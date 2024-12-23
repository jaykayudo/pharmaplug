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
        payment_method = data["payment_method"]
        cart_items = models.CartItem.objects.filter(cart=cart).select_related("product")
        for item in cart_items:
            models.OrderItem.objects.create(
                order=order, product=item.product, quantity=item.quantity
            )
        # close cart
        cart.status = models.CartStatus.CLOSED
        cart.save()
        logger.info(f"Order for user {user} with id {order.id_as_str} created")
        if payment_method == models.OrderPaymentMethod.CARD:
            transaction = models.Transaction.objects.create(
                user=user, amount=order.price + delivery_fee
            )
            order.transaction = transaction
            order.save()
            return {
                "order": order.id_as_str,
                "ref": transaction.ref,
                "payment_method": payment_method,
                "amount": order.price + delivery_fee,
                "key": settings.PAYSTACK_PUBLIC_KEY,
                "email": order.email,
            }
        return {
            "order": order.id_as_str,
            "payment_method": payment_method,
            "email": order.email,
            "amount": order.price + delivery_fee,
        }

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

    @classmethod
    def check_doctor_available(
        cls,
        doctor: models.Doctor,
        date,
        start_time: timezone.datetime.time,
        duration: int,
    ):
        end_time = timezone.datetime.combine(
            timezone.datetime.today(), start_time
        ) + timezone.timedelta(hours=duration)
        end_time = end_time.time()
        doctor_schedule = models.Consultation.objects.filter(
            doctor=doctor, day=date, start_time__gte=start_time, end_time__lte=end_time
        )
        if doctor_schedule.exists():
            return False
        return True

    @classmethod
    def calculate_consult_fee(
        cls, doctor: models.Doctor, time: timezone.datetime.time, duration: int
    ):
        doctor_price = doctor.rate
        per_rate = doctor.per_rate
        if per_rate == models.DoctorPerRate.HOUR:
            return doctor_price * Decimal(duration)
        else:
            return doctor_price

    @classmethod
    def book_consult(
        cls,
        doctor: models.Doctor,
        date: timezone.datetime.date,
        start_time: timezone.datetime.time,
        duration: int,
        note: str,
        user: models.User,
    ):
        end_time = timezone.datetime.combine(
            timezone.datetime.today(), start_time
        ) + timezone.timedelta(hours=duration)
        end_time = end_time.time()
        cost = cls.calculate_consult_fee(doctor, start_time, duration)
        consult = models.Consultation.objects.create(
            doctor=doctor,
            day=date,
            start_time=start_time,
            end_time=end_time,
            note=note,
            cost=cost,
            user=user,
        )
        return consult


class NotificationService:
    def send_welcome_notification(cls, user: models.User):
        title = "Welcome to Pharmaplug"
        message = """
            Welcome to pharmaplug
        """
        notification = models.Notification.objects.create(
            user = user,
            title = title,
            content = message
        )
        notification.send_email()

    def send_order_successful_notification(cls, order: models.Order):
        title = "Your Order has been placed"
        content="This is to notify you that your order has been placed successfully"
        notification = models.Notification.objects.create(
            user = order.user,
            title = title,
            content = content
        )
        notification.send_email()

    def send_consulation_creation_notification(cls, consultation: models.Consultation):
        user_title = "Your Consultation request"
        user_content = (
            "You have created consultation request and the doctor has been notified. "
            "You will receive a notification after the doctor accept or reject the consultation. "
            "If the doctor accepts, you will pay required to pay the fees before receiving further informations "
            "which included the meeting location."
        )
        doctor_title = "A Consultation has been request from you"
        doctor_content = (
            f"{consultation.user} has request a consultation with you.\n"
            f"Date: {consultation.day} \n"
            f"Time: {consultation.start_time} - {consultation.end_time}"
            f"View on your dashboard to accept or reject the consultation"            
        )
        user_notification = models.Notification.objects.create(
            user = consultation.user,
            title = user_title,
            content = user_content
        )
        user_notification.send_email()

        doctor_notification = models.Notification.objects.create(
            user = consultation.doctor.user,
            title = doctor_title,
            content = doctor_content
        )
        doctor_notification.send_email()

    def send_consulation_acceptance_notification(cls, consultation: models.Consultation):
        user_title = "Your Consultation request has been accepted"
        user_content = (
            f"Your Consulation request with Dr. {consultation.doctor} has been accepted.\n"
            "Login to your dashboard to make the payment. "
            f"Payment needs to have been made 30 minutes before consulation time."
        )
        user_notification = models.Notification.objects.create(
            user = consultation.user,
            title = user_title,
            content = user_content
        )
        user_notification.send_email()

        doctor_title = "Consultation Accepted"
        doctor_content = (
            f"You have accepted consultation with {consultation.user}.\n"
            f"Date: {consultation.day} \n"
            f"Time: {consultation.start_time} - {consultation.end_time}"
        )
        doctor_notification = models.Notification.objects.create(
            user = consultation.doctor.user,
            title = doctor_title,
            content = doctor_content
        )
        doctor_notification.send_email()

    def send_consulation_rejection_notification(cls, consultation: models.Consultation):
        user_title = "Your Consultation request has been declined"
        user_content = (
            f"Your Consulation request with Dr. {consultation.doctor} has been declined.\n"
            f"Reasons: {consultation.details}. "
            "Please check other doctors to book consultations"
        )
        user_notification = models.Notification.objects.create(
            user = consultation.user,
            title = user_title,
            content = user_content
        )
        user_notification.send_email()

        doctor_title = "Consultation Accepted"
        doctor_content = (
            f"You have accepted consultation with {consultation.user}.\n"
            f"Date: {consultation.day} \n"
            f"Time: {consultation.start_time} - {consultation.end_time}"
        )
        doctor_notification = models.Notification.objects.create(
            user = consultation.doctor.user,
            title = doctor_title,
            content = doctor_content
        )
        doctor_notification.send_email()
    
    def send_consultation_payment_notification(cls, consultation: models.Consultation):
        user_title = "Consultation payment successful"
        user_content = (
            f"Your Consulation with Dr. {consultation.doctor} has been paid for successfully.\n"
            f"Extra details: {consultation.details}"
        )
        user_notification = models.Notification.objects.create(
            user = consultation.user,
            title = user_title,
            content = user_content
        )
        user_notification.send_email()

        doctor_title = f"Consultation with {consultation.user} Paid"
        doctor_content = (
            f"Consultation with {consultation.user} has been paid.\n"
            f"Date: {consultation.day} \n"
            f"Time: {consultation.start_time} - {consultation.end_time}"
            f"Extra Details: {consultation.details}"
            "Please be available by this time at the communicated location"
        )
        doctor_notification = models.Notification.objects.create(
            user = consultation.doctor.user,
            title = doctor_title,
            content = doctor_content
        )
        doctor_notification.send_email()

    def send_consultation_completion_notification(cls, consultation: models.Consultation):
        user_title = "Consultation completed successfully"
        user_content = (
            f"Your Consulation with Dr. {consultation.doctor} has been completed.\n"
            f"Thank you for your service"
        )
        user_notification = models.Notification.objects.create(
            user = consultation.user,
            title = user_title,
            content = user_content
        )
        user_notification.send_email()

        doctor_title = f"Consultation completed successfully "
        doctor_content = (
            f"Consultation with {consultation.user} has been completed.\n"
            f"Thank you for your service"
        )
        doctor_notification = models.Notification.objects.create(
            user = consultation.doctor.user,
            title = doctor_title,
            content = doctor_content
        )
        doctor_notification.send_email()
