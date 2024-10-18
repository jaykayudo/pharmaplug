import calendar
import logging
from decimal import Decimal
import io
import weasyprint

from . import models, payment

from django.utils import timezone
from django.template.loader import render_to_string
from django.conf import settings
from django.core.files import File

logger = logging.getLogger(__name__)


class CoreService:
    @classmethod
    def get_alternative_drug(cls, product: models.Product):
        pass

    @classmethod
    def add_to_cart(
        cls, cart: models.Cart | None, user: models.User | None, product: models.Product
    ):
        if not cart:
            cart = models.Cart.objects.create()
            if user:
                cart.user = user
        cart.add_to_cart(product)
        return cart.id_as_str

    @classmethod
    def calculate_delivery_fee(cls, state: str, region: str):
        return Decimal("10000")

    @classmethod
    def create_order(cls, user: models.User = None, **data):
        cart: models.Cart = data.pop("cart")
        delivery_fee = cls.calculate_delivery_fee(data["state"], data["region"])
        order = models.Order.objects.create(
            **data, delivery_fee=delivery_fee, price=cart.calculate_price(), user=user
        )
        cart_items = models.CartItem.objects.filter(cart=cart).select_related("product")
        for item in cart_items:
            models.OrderItem.objects.create(
                order=order, product=item.product, quantity=item.quantity
            )
        # close cart
        cart.status = models.CartStatus.CLOSED
        cart.save()
        logger.info(f"Order for user {user} with id {order.id_as_str} created")
        return order

    @classmethod
    def verify_order_payment(cls, order: models.Order):
        ref = order.transaction.ref
        response = payment.Paystack().verify_payment(ref)
        if not response["status"]:
            return False
        return True

    @classmethod
    def get_order_reciept(cls, order: models.Order):
        data = {
            "file_name": f"order_{order.id_as_str}.pdf",
        }
        if order.receipt:
            with open(order.receipt.file, "rb") as file:
                data["file"] = file.read()
        else:
            html = render_to_string("order-receipt-pdf.html", {"order": order})
            buffer = io.BytesIO()
            weasyprint.HTML(string=html).write_pdf(
                buffer,
                stylesheets=[weasyprint.CSS(settings.STATIC_ROOT / "css/pdf.css")],
            )
            buffer.seek(0)
            file = File(buffer, f"order_{order.id_as_str}")
            order.receipt = file
            order.save()
            data["file"] = buffer.read()
        return data

    @classmethod
    def initialize_consultation_payment(cls, consultation: models.Consultation):
        transaction = models.Transaction.objects.create(
            user=consultation.user, amount=consultation.cost
        )
        consultation.transaction = transaction
        consultation.save()
        data = {"transaction": transaction.ref, "consultation": consultation.id_as_str}
        return data

    @classmethod
    def verify_consultation_payment(cls, consultation: models.Consultation):
        ref = consultation.transaction.ref
        response = payment.Paystack().verify_payment(ref)
        if not response["status"]:
            return False
        return True

    @classmethod
    def get_consultation_reciept(cls, consultation: models.Consultation):
        data = {
            "file_name": f"consultation_{consultation.id_as_str}.pdf",
        }

        html = render_to_string(
            "consultation-receipt-pdf.html", {"consultation": consultation}
        )
        buffer = io.BytesIO()
        weasyprint.HTML(string=html).write_pdf(
            buffer, stylesheets=[weasyprint.CSS(settings.STATIC_ROOT / "css/pdf.css")]
        )
        buffer.seek(0)

        data["file"] = buffer.read()
        return data

    @classmethod
    def get_doctor_available_time(cls, doctor: models.Doctor):
        consults = models.Consultation.objects.filter(doctor=doctor)
        schedule = doctor.schedule
        day_bank = []  # don't mind the name please, it just happened :)
        today = timezone.datetime.today()
        current_working_time = today
        while day_bank < 10:
            calendar_day = (
                int(
                    calendar.weekday(
                        current_working_time.year,
                        current_working_time.month,
                        current_working_time.day,
                    )
                )
                + 1
            )  # map it to our own integer day
            if calendar_day > schedule.end_day or calendar_day < schedule.start_day:
                current_working_time = current_working_time + timezone.timedelta(days=1)
                logger.info(f"Skipping {calendar_day}")
                continue
            if current_working_time == today:
                pass
