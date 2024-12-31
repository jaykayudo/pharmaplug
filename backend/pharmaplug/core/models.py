import uuid
import secrets
import random
import string
from decimal import Decimal


from django.db import models, transaction as db_transaction
from django.db.models import F
from django.core.validators import MinValueValidator
from django.contrib.auth.models import AbstractUser, UserManager
from django.utils.translation import gettext_lazy as _
from django.utils import timezone
from django.core.signing import TimestampSigner, SignatureExpired, BadSignature
from django.core.mail import EmailMessage
from django.conf import settings
from django.utils.crypto import get_random_string
from django.contrib.contenttypes.fields import GenericForeignKey, GenericRelation
from django.contrib.contenttypes.models import ContentType

from .validators import phone_number_validator
from .payment import Paystack


class Days(models.IntegerChoices):
    MONDAY = 1, "Monday"
    TUESDAY = 2, "Tuesday"
    WEDNESDAY = 3, "Wednesday"
    THURSDAY = 4, "Thursday"
    FRIDAY = 5, "Friday"
    SATURDAY = 6, "Saturday"
    SUNDAY = 7, "Sunday"


class OrderPaymentMethod(models.IntegerChoices):
    ON_DELIVERY = 0, "On Delivery"
    CARD = 1, "Card"


class OrderDeliveryMethod(models.IntegerChoices):
    HOME = 0, "Home"
    PICKUP_STATION = 1, "Pickup station"


class ConsultationStatus(models.IntegerChoices):
    PENDING = 1, "Pending"
    ACCEPTED = 2, "Accepted"
    REJECTED = 3, "Rejected"
    PAID = 4, "Paid"
    ONGOING = 5, "Ongoing"
    FINISHED = 6, "Finished"


class TransactionStatus(models.IntegerChoices):
    INITAILIZED = 0, "Initialized"
    VERIFIED = 1, "Verified"
    DECLINED = 2, "Declined"
    INVALID = 3, "Invalid"


class TransactionType(models.TextChoices):
    ORDER = "order", "Order"
    CONSULTATION = "consultation", "Consultation"
    WALLET = "wallet", "Wallet"


class WalletTransactionType(models.IntegerChoices):
    CREDIT = 1, "Credit"
    DEBIT = 0, "Debit"


class OrderStatus(models.IntegerChoices):
    NEW = 10, "New"
    CANCELLED = 20, "Cancelled"
    PAID = 30, "Paid"
    DELIVERED = 40, "Delivered"


class CartStatus(models.IntegerChoices):
    OPEN = 10, "Open"
    CLOSED = 20, "Closed"


class OTPReasons(models.TextChoices):
    EMAIL_VERIFICATION = "email_verification", "Email Verification"
    PASSWORD_RESET = "password_reset", "Password Reset"


class DoctorPerRate(models.IntegerChoices):
    HOUR = 0, "Hour"
    CONSULTATION = 1, "Consultation"


class AuthProvider(models.TextChoices):
    EMAIL = "email", "Email"
    GOOGLE = "google", "Google"


class BaseModel(models.Model):
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True
        ordering = ("created_at",)

    @property
    def id_as_str(self) -> str:
        return str(self.id)


class BaseManager(UserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        """
        Create and save a user with the given username, email, and password.
        """
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(email, password, **extra_fields)

    def create_superuser(self, email, password, **extra_fields):
        extra_fields.setdefault("first_name", "Admin " + str(secrets.token_urlsafe(8)))
        extra_fields.setdefault("username", "Admin " + str(secrets.token_urlsafe(8)))
        extra_fields.setdefault(
            "phone_number", "0901234" + str(random.randint(1000, 9999))
        )
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


class User(AbstractUser, BaseModel):
    first_name = models.CharField(
        _("First name"),
        max_length=150,
        help_text=_("Required. 150 characters or fewer. Letters only."),
    )
    last_name = models.CharField(
        _("Last name"),
        max_length=150,
        help_text=_("Required. 150 characters or fewer. Letters only."),
        blank=True,
        null=True,
    )
    email = models.EmailField(
        _("Email"),
        max_length=150,
        unique=True,
        help_text=_(
            "Required. 150 characters or fewer. Letters, digits and @/./+/-/_ only."
        ),
        error_messages={
            "unique": _("A user with that email already exists."),
        },
    )
    phone_number = models.CharField(
        _("Phone Number"),
        max_length=11,
        validators=[phone_number_validator],
        help_text=_("Required. 11 Nigeria Phone Numbers."),
        error_messages={
            "max_length": _("11 Numbers required."),
            "unique": _("A user with this phone number already exists."),
        },
        unique=True,
    )
    is_doctor = models.BooleanField(default=False)
    email_verified = models.BooleanField(default=False)
    auth_provider = models.CharField(max_length=15, default=AuthProvider.EMAIL)
    objects = BaseManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self) -> str:
        return self.get_full_name()


class OTPManager(models.Manager):
    def create(self, **kwargs):
        model = self.model(**kwargs)
        code = model.set_code()
        model.save(using=self._db)
        return code, model


class OTP(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    reason = models.CharField(choices=OTPReasons.choices, max_length=20)
    code = models.TextField()
    objects = OTPManager()

    @property
    def get_expiry_time(self):
        return timezone.timedelta(minutes=10)

    def set_code(self):
        code = get_random_string(6, string.digits)
        encoded_code = TimestampSigner().sign(code)
        self.code = encoded_code
        return code

    def verify_code(self, code: str):
        try:
            decoded_code = TimestampSigner().unsign(
                self.code, max_age=self.get_expiry_time
            )
            return code == decoded_code
        except (BadSignature, SignatureExpired):
            return False


class Notification(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100)
    content = models.TextField()
    html_content = models.TextField(blank=True, null=True)
    read = models.BooleanField(default=False)

    def __str__(self):
        return self.title

    def send_email(self, is_html=False, fail_silently=True):
        mail = EmailMessage(
            self.title,
            self.content if is_html else self.html_content,
            settings.DEFAULT_FROM_EMAIL,
            [self.user.email],
        )
        if is_html:
            mail.content_subtype = "html"
        mail.send(fail_silently=fail_silently)


class Sickness(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="sicknesses", blank=True, null=True)
    common = models.BooleanField(default=False)

    class Meta:
        verbose_name_plural = "sicknesses"
        ordering = ("created_at",)

    def __str__(self) -> str:
        return self.name


class DoctorCategory(BaseModel):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    image = models.ImageField(upload_to="doctor_categories", blank=True, null=True)

    class Meta:
        verbose_name_plural = "doctor categories"
        ordering = ("created_at",)

    def __str__(self) -> str:
        return self.name


class Doctor(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to="doctors", blank=True, null=True)
    field = models.ForeignKey(DoctorCategory, null=True, on_delete=models.SET_NULL)
    is_available = models.BooleanField(default=True)
    rate = models.DecimalField(default=Decimal("0.00"), max_digits=10, decimal_places=2)
    per_rate = models.IntegerField(
        default=DoctorPerRate.HOUR, choices=DoctorPerRate.choices
    )

    def __str__(self) -> str:
        return self.user.get_full_name()

    def pending_consultations(self):
        return Consultation.objects.filter(
            doctor=self, status=ConsultationStatus.PENDING
        )


class Pharmacy(BaseModel):
    name = models.CharField(max_length=200)

    class Meta:
        verbose_name_plural = "pharmacies"
        ordering = ("created_at",)

    def __str__(self) -> str:
        return self.name


class Product(BaseModel):
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to="product")
    sicknesses = models.ManyToManyField(Sickness, blank=True)
    medication = models.TextField()
    caution = models.TextField(blank=True, null=True)
    pharmacy = models.ForeignKey(Pharmacy, on_delete=models.CASCADE)
    in_stock = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name


class Consultation(BaseModel):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    day = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    cost = models.DecimalField(max_digits=15, decimal_places=2)
    note = models.TextField()
    status = models.IntegerField(
        default=ConsultationStatus.PENDING, choices=ConsultationStatus.choices
    )
    details = models.TextField(null=True, blank=True)

    def __str__(self) -> str:
        return self.note


class Transaction(BaseModel):
    user = models.ForeignKey(
        User,
        related_name="transactions",
        on_delete=models.SET_NULL,
        blank=True,
        null=True,
    )
    ref = models.CharField(max_length=200, editable=False)
    amount = models.DecimalField(max_digits=15, decimal_places=2)
    status = models.IntegerField(
        choices=TransactionStatus.choices, default=TransactionStatus.INITAILIZED
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    type = models.CharField(max_length=20, choices=TransactionType.choices)

    object_ct = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.UUIDField()
    object = GenericForeignKey("object_ct", "object_id")

    class Meta:
        ordering = ("created_at",)

    @property
    def is_verified(self):
        return self.status == TransactionStatus.VERIFIED

    @property
    def is_pending(self):
        return self.status == TransactionStatus.INITAILIZED

    def change_status(self, status: TransactionStatus):
        self.status = status
        self.save()

    def initailize(self, **kwargs):
        domain = kwargs.get("domain", "")
        success_url = f"{domain}/tx/{self.ref}/verify/"
        data = Paystack().initalize_payment(self.user.email, self.amount)

    def save(self, *args, **kwargs):
        while not self.ref:
            ref = secrets.token_urlsafe(50)
            similar_ref = Transaction.objects.filter(ref=ref)
            if not similar_ref.exists():
                self.ref = ref
                break
        super().save(*args, **kwargs)

    def __str__(self):
        return self.ref


class Wallet(BaseModel):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    amount = models.DecimalField(
        max_digits=12, decimal_places=2, default=Decimal("0.00")
    )
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.user.email

    @db_transaction.atomic()
    def add_balance(self, amount: str | int | float):
        self.amount = F("amount") + Decimal(amount)
        self.save()
        WalletTransaction.objects.create(
            wallet=self, amount=Decimal("amount"), type=WalletTransactionType.CREDIT
        )

    @db_transaction.atomic()
    def substract_balance(self, amount: str | int | float):
        self.amount = F("amount") - Decimal(amount)
        self.save()
        WalletTransaction.objects.create(
            wallet=self, amount=Decimal("amount"), type=WalletTransactionType.DEBIT
        )

    def has_balance(self, amount: str | int | float):
        return self.amount >= Decimal(amount)


class WalletTransaction(BaseModel):
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE)
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    type = models.IntegerField(choices=WalletTransactionType.choices)


class Cart(BaseModel):
    user = models.ForeignKey(User, null=True, on_delete=models.CASCADE)
    status = models.IntegerField(default=CartStatus.OPEN, choices=CartStatus.choices)

    def add_to_cart(self, product: Product):
        cart_item, created = CartItem.objects.get_or_create(cart=self, product=product)
        if not created:
            cart_item.quantity += 1
            cart_item.save()
        return cart_item

    def calculate_price(self):
        return sum(
            [
                (cart_item.product.price * cart_item.quantity)
                for cart_item in self.cartitem_set.all()
            ]
        )


class CartItem(BaseModel):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])


class ContactDetail(BaseModel):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=11,
        validators=[phone_number_validator],
        help_text=_("Required. 11 Nigeria Phone Numbers."),
    )
    state = models.CharField(max_length=30)
    region = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.user.get_full_name()


class Order(BaseModel):
    order_id = models.PositiveBigIntegerField(unique=True, editable=False)
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    phone_number = models.CharField(
        max_length=11,
        validators=[phone_number_validator],
        help_text=_("Required. 11 Nigeria Phone Numbers."),
    )
    state = models.CharField(max_length=30)
    region = models.CharField(max_length=50)
    address = models.TextField()
    payment_method = models.IntegerField(choices=OrderPaymentMethod.choices)
    delivery_method = models.IntegerField(choices=OrderDeliveryMethod.choices)
    receipt = models.FileField(null=True, blank=True, upload_to="order-receipts")
    paid = models.BooleanField(default=False)
    price = models.DecimalField(max_digits=15, decimal_places=2)
    delivery_fee = models.DecimalField(max_digits=15, decimal_places=2)
    transactions = GenericRelation(Transaction)
    status = models.IntegerField(default=OrderStatus.NEW, choices=OrderStatus.choices)

    def __str__(self) -> str:
        return self.full_name

    @property
    def total_price(self):
        return self.price + self.delivery_fee

    @property
    def item_count(self):
        """
        All items in the order
        """
        return sum([item.quantity for item in self.orderitems.all()])

    def save(self, *args, **kwargs) -> None:
        if not self.order_id:
            max_id = Order.objects.aggregate(models.Max("order_id"))["order_id__max"]
            self.order_id = (max_id or 0) + 1
        return super().save(*args, **kwargs)


class OrderItem(BaseModel):
    order = models.ForeignKey(
        Order, on_delete=models.CASCADE, related_name="orderitems"
    )
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])


class Story(BaseModel):
    title = models.CharField(max_length=200)
    content = models.TextField()
    image = models.ImageField(upload_to="stories")

    def __str__(self) -> str:
        return self.title
