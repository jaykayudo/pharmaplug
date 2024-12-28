from django.db import transaction as db_transaction
from django.contrib.auth import password_validation, login
from django.core.exceptions import ValidationError as DjangoValidationError
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

from rest_framework import serializers, generics
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.validators import UniqueValidator

from . import models, exceptions, service
from .utils import generated_username_from_email


class SimpleUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        fields = ["id", "email", "first_name", "last_name"]
        read_only_fields = ["id", "email"]

    def to_internal_value(self, data):
        return super().to_internal_value(data)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.User
        read_only_fields = [
            "is_active",
            "is_doctor",
            "username",
            "is_staff",
            "is_superuser",
        ]
        exclude = ["groups", "user_permissions"]
        extra_kwargs = {
            "id": {"read_only": True},
            "password": {"write_only": True},
            "date_joined": {"read_only": True},
            "last_login": {"read_only": True},
            "phone_number": {
                "validators": [UniqueValidator(queryset=models.User.objects.all())]
            },
        }

    def validate_password(self, password):
        try:
            password_validation.validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return password

    @db_transaction.atomic
    def create(self, validated_data: dict[str, str]):
        username = generated_username_from_email(validated_data["email"])
        counter = 1  # a little hack to prevent infinite hack :)
        while models.User.objects.filter(username=username).exists():
            username = generated_username_from_email(
                validated_data["email"], use_random=True
            )
            counter += 1
            if counter > 50:
                break
        user = models.User.objects.create(
            username=username,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_number=validated_data["phone_number"],
        )
        user.set_password(validated_data["password"])
        user.save()
        code, _ = models.OTP.objects.create(
            user=user, reason=models.OTPReasons.EMAIL_VERIFICATION
        )
        user.email_user(
            "Email Verification",
            f"Use this code to verify your email: {code}",
            settings.DEFAULT_FROM_EMAIL,
            fail_silently=True,
        )
        return user

    def save(self, **kwargs):
        user = super().save(**kwargs)
        service.NotificationService.send_welcome_notification(user)
        user_data = UserSerializer(user).data
        token_data_obj = RefreshToken.for_user(user)
        expiry = token_data_obj.access_token["exp"]
        token_data = {
            "access": str(token_data_obj.access_token),
            "refresh": str(token_data_obj),
            "expiry": expiry,
        }
        login(self.context["request"], user)
        return {**user_data, **token_data}


class DoctorUserCreateSerializer(serializers.ModelSerializer):
    field = serializers.UUIDField()

    class Meta:
        model = models.User
        fields = [
            "first_name",
            "last_name",
            "phone_number",
            "email",
            "password",
            "field",
        ]
        extra_kwargs = {
            "id": {"read_only": True},
            "password": {"write_only": True},
            "date_joined": {"read_only": True},
            "last_login": {"read_only": True},
            "phone_number": {
                "validators": [UniqueValidator(queryset=models.User.objects.all())]
            },
        }

    def validate_password(self, password):
        try:
            password_validation.validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return password

    def validate(self, attrs):
        try:
            field = models.DoctorCategory.objects.get(id=attrs["field"])
            self.context["field"] = field
        except models.DoctorCategory.DoesNotExist:
            raise serializers.ValidationError(
                {"detail": "field does not exit"}, code=404
            )
        return attrs

    @db_transaction.atomic
    def create(self, validated_data: dict[str, str]):
        username = generated_username_from_email(validated_data["email"])
        counter = 1  # a little hack to prevent infinite hack :)
        while models.User.objects.filter(username=username).exists():
            username = generated_username_from_email(
                validated_data["email"], use_random=True
            )
            counter += 1
            if counter > 50:
                break
        user = models.User.objects.create(
            username=username,
            email=validated_data["email"],
            first_name=validated_data["first_name"],
            last_name=validated_data["last_name"],
            phone_number=validated_data["phone_number"],
            is_doctor=True,
        )
        user.set_password(validated_data["password"])
        user.save()
        models.Doctor.objects.create(user=user, field=self.context["field"])
        code, _ = models.OTP.objects.create(
            user=user, reason=models.OTPReasons.EMAIL_VERIFICATION
        )
        user.email_user(
            "Email Verification",
            f"Use this code to verify your email: {code}",
            settings.DEFAULT_FROM_EMAIL,
            fail_silently=True,
        )
        return user

    def save(self, **kwargs):
        user = super().save(**kwargs)
        service.NotificationService.send_welcome_notification(user)
        user_data = UserSerializer(user).data
        token_data_obj = RefreshToken.for_user(user)
        expiry = token_data_obj.access_token["exp"]
        token_data = {
            "access": str(token_data_obj.access_token),
            "refresh": str(token_data_obj),
            "expiry": expiry,
        }
        login(self.context["request"], user)
        return {**user_data, **token_data}


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, attrs):
        users = models.User.objects.filter(email=attrs["email"])
        if not users.exists():
            raise exceptions.IncorrectCredentials
        user = users.first()
        if not user.check_password(attrs["password"]):
            raise exceptions.IncorrectCredentials
        self.context["user"] = user
        return attrs

    def save(self):
        user = self.context["user"]
        user_data = UserSerializer(user).data
        token_data_obj = RefreshToken.for_user(user)
        expiry = token_data_obj.access_token["exp"]
        token_data = {
            "access": str(token_data_obj.access_token),
            "refresh": str(token_data_obj),
            "expiry": expiry,
        }
        return {**user_data, **token_data}


class VerifyEmailSerializer(serializers.Serializer):
    user = serializers.UUIDField()
    code = serializers.CharField()

    def validate(self, attrs):
        try:
            user = models.User.objects.get(id=attrs["user"])

        except models.User.DoesNotExist:
            raise exceptions.InvalidToken
        otp_list = models.OTP.objects.filter(user=user)
        if not otp_list.exists():
            raise exceptions.InvalidSession
        otp = otp_list.order_by("-created_at").first()
        if not otp.verify_code(attrs["code"]):
            raise exceptions.InvalidToken
        self.context["user"] = user
        otp.delete()
        return attrs

    def save(self):
        user = self.context["user"]
        user.email_verified = True
        user.save()
        user.email_user(
            "Email Verification Completed",
            f"Your email has been verified successfully.\nWelcome to Pharmaplug, {user.first_name}",
            settings.DEFAULT_FROM_EMAIL,
            fail_silently=True,
        )


class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.CharField()

    def validate(self, attrs):
        try:
            user = models.User.objects.get(email=attrs["email"])
        except models.User.DoesNotExist:
            raise serializers.ValidationError(
                {"details": "User with email does not exist"}, code=404
            )
        self.context["user"] = user
        return attrs

    def save(self):
        user = self.context["user"]
        code, _ = models.OTP.objects.create(
            user=user, reason=models.OTPReasons.EMAIL_VERIFICATION
        )
        user.email_user(
            "Password Reset",
            (
                f"You have requested to reset your password."
                f"Use this code to reset it {code}"
                "If this is not you, ignore this email or contact support"
            ),
            settings.DEFAULT_FROM_EMAIL,
            fail_silently=True,
        )
        return user.id


class CodeVerifySerializer(serializers.Serializer):
    user = serializers.UUIDField()
    code = serializers.CharField()

    def validate(self, attrs):
        try:
            user = models.User.objects.get(id=attrs["user"])

        except models.User.DoesNotExist:
            raise exceptions.InvalidToken
        otp_list = models.OTP.objects.filter(user=user)
        if not otp_list.exists():
            raise exceptions.InvalidSession
        otp = otp_list.order_by("-created_at").first()
        if not otp.verify_code(attrs["code"]):
            raise exceptions.InvalidToken
        return attrs


class ResetPasswordSerializer(serializers.Serializer):
    user = serializers.UUIDField()
    code = serializers.CharField()
    password = serializers.CharField()

    def validate_password(self, password):
        try:
            password_validation.validate_password(password)
        except DjangoValidationError as e:
            raise serializers.ValidationError(e.messages)
        return password

    def validate(self, attrs):
        try:
            user = models.User.objects.get(id=attrs["user"])

        except models.User.DoesNotExist:
            raise exceptions.InvalidToken
        otp_list = models.OTP.objects.filter(user=user)
        if not otp_list.exists():
            raise exceptions.InvalidSession
        otp = otp_list.order_by("-created_at").first()
        if not otp.verify_code(attrs["code"]):
            raise exceptions.InvalidToken
        self.context["user"] = user
        otp.delete()
        return attrs

    def save(self):
        user = self.context["user"]
        user.set_password(self.validated_data["password"])
        user.save()


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    confirm_new_password = serializers.CharField(min_length=8)

    def validate(self, attrs):
        """
        Validate all the fields
        """
        request = self.context["request"]
        user = models.User.objects.get(id=request.user.id)
        if not user.check_password(attrs["old_password"]):
            raise serializers.ValidationError(
                {"old_password": "Password does not match current password"}
            )
        if attrs["new_password"] != attrs["confirm_new_password"]:
            raise serializers.ValidationError(
                {"confirm_new_password": "Password does not match confirm password"}
            )
        try:
            password_validation.validate_password(attrs["new_password"])
        except DjangoValidationError as err:
            raise serializers.ValidationError({"new_password": err})
        return attrs

    @db_transaction.atomic
    def save(self):
        """
        Method to change the password of the user
        """
        request = self.context["request"]
        user = models.User.objects.get(id=request.user.id)
        user.set_password(self.validated_data["new_password"])
        user.save()
        return user


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Notification
        fields = "__all__"


class StorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Story
        fields = "__all__"


class SicknessSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Sickness
        fields = "__all__"


class PharmacySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Pharmacy
        fields = "__all__"


class DoctorCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = models.DoctorCategory
        fields = "__all__"


class DoctorSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()
    field = DoctorCategorySerializer()

    class Meta:
        model = models.Doctor
        fields = "__all__"


class DoctorVerifySchedule(serializers.Serializer):
    date = serializers.DateField()
    time = serializers.TimeField()
    duration = serializers.IntegerField(default=1)

    def save(self):
        check = service.CoreService.check_doctor_available(
            self.context["doctor"],
            self.validated_data["date"],
            self.validated_data["time"],
            self.validated_data["duration"],
        )
        return check


class DoctorConsultFeeSerializer(serializers.Serializer):
    date = serializers.DateField()
    time = serializers.TimeField()
    duration = serializers.IntegerField(default=1)

    def save(self):
        fee = service.CoreService.calculate_consult_fee(
            self.context["doctor"],
            self.validated_data["time"],
            self.validated_data["duration"],
        )
        return fee


class SimpleProductSerialier(serializers.ModelSerializer):
    class Meta:
        model = models.Product
        fields = ["name", "price", "image"]
        read_only_fields = ["name", "price", "image"]


class ProductSerializer(serializers.ModelSerializer):
    sicknesses = SicknessSerializer(many=True)
    pharmacy = PharmacySerializer()

    class Meta:
        model = models.Product
        fields = "__all__"


class WalletSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()

    class Meta:
        model = models.Wallet
        fields = "__all__"


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.WalletTransaction
        fields = "__all__"


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer()

    class Meta:
        model = models.CartItem
        fields = "__all__"


class CartSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer(required=False)
    cart_items = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = models.Cart
        fields = "__all__"

    def get_cart_items(self, obj):
        cartlines = obj.cartitem_set.all()
        data = CartItemSerializer(cartlines, many=True).data
        return data

    def get_price(self, obj):
        return obj.calculate_price()


class OrderItemSerializer(serializers.ModelSerializer):
    product = SimpleProductSerialier()
    total_price = serializers.SerializerMethodField()

    class Meta:
        model = models.OrderItem
        fields = "__all__"

    def get_total_price(self, obj):
        return obj.product.price * obj.quantity


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField()

    class Meta:
        model = models.Order
        fields = "__all__"

    def get_order_items(self, obj):
        orderlines = obj.orderitems.all()
        data = OrderItemSerializer(orderlines, many=True).data
        return data


class AddToCartSerializer(serializers.Serializer):
    cart = serializers.UUIDField(required=False)
    product = serializers.UUIDField()

    def validate(self, attrs):
        if attrs.get("cart"):
            cart = generics.get_object_or_404(
                models.Cart, id=attrs["cart"], status=models.CartStatus.OPEN
            )
            self.context["cart"] = cart
        product = generics.get_object_or_404(models.Product, id=attrs["product"])
        if not product.in_stock:
            raise exceptions.ProductNotInStock
        self.context["product"] = product
        return attrs

    @db_transaction.atomic
    def save(self):
        cart = self.context.get("cart")
        product = self.context["product"]
        user = self.context.get("user")
        data = service.CoreService.add_to_cart(cart, user, product)
        return data


class DeleteFromCartSerializer(serializers.Serializer):
    cart = serializers.UUIDField()
    cart_items = serializers.ListField(child=serializers.UUIDField())

    def validate(self, attrs):
        cart = generics.get_object_or_404(
            models.Cart, id=attrs["cart"], status=models.CartStatus.OPEN
        )
        self.context["cart"] = cart
        for cart_item in attrs["cart_items"]:
            item = generics.get_object_or_404(models.CartItem, cart=cart, id=cart_item)
            self.context.setdefault("cart_item", []).append(item)
        return attrs

    @db_transaction.atomic
    def save(self):
        for item in self.context["cart_item"]:
            item.delete()


class CartIncreaseQuantitySerializer(serializers.Serializer):
    cart = serializers.UUIDField()
    item = serializers.UUIDField()
    quantity = serializers.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )

    def validate(self, attrs):
        cart = generics.get_object_or_404(
            models.Cart, id=attrs["cart"], status=models.CartStatus.OPEN
        )
        self.context["cart"] = cart
        item = generics.get_object_or_404(models.CartItem, cart=cart, id=attrs["item"])
        self.context["item"] = item
        return attrs

    def save(self):
        item = self.context["item"]
        item.quantity += self.validated_data["quantity"]
        item.save()


class CartDecreaseQuantitySerializer(serializers.Serializer):
    cart = serializers.UUIDField()
    item = serializers.UUIDField()
    quantity = serializers.IntegerField(
        default=1, validators=[MinValueValidator(1), MaxValueValidator(100)]
    )

    def validate(self, attrs):
        cart = generics.get_object_or_404(
            models.Cart, id=attrs["cart"], status=models.CartStatus.OPEN
        )
        self.context["cart"] = cart
        item = generics.get_object_or_404(models.CartItem, cart=cart, id=attrs["item"])
        self.context["item"] = item
        return attrs

    def save(self):
        item = self.context["item"]
        if item.quantity > 1:
            item.quantity -= self.validated_data["quantity"]
            item.save()


class MergeCartSerializer(serializers.Serializer):
    cart = serializers.UUIDField()

    def validate(self, attrs):
        cart = generics.get_object_or_404(models.Cart, id=attrs["cart"])
        self.context["cart"] = cart
        return attrs

    @db_transaction.atomic
    def save(self):
        user = self.context["user"]
        cart = self.context["cart"]
        carts = models.Cart.objects.filter(user=user, status=models.CartStatus.OPEN)
        if carts.exists():
            user_cart = carts.first()
            # shift all the cart cart_items to the user cart
            models.CartItem.objects.filter(cart=cart).update(cart=user_cart)
            # delete the cart as it is an orphan cart :)
            cart.delete()
            return user_cart.id_as_str
        else:
            cart.user = user
            cart.save()
            return cart.id_as_str


class CheckoutSerializer(serializers.Serializer):
    email = serializers.EmailField()
    full_name = serializers.CharField()
    phone_number = serializers.CharField()
    state = serializers.CharField()
    region = serializers.CharField()
    address = serializers.CharField()
    payment_method = serializers.ChoiceField(choices=models.OrderPaymentMethod)
    delivery_method = serializers.ChoiceField(choices=models.OrderDeliveryMethod)
    cart = serializers.UUIDField()

    def validate(self, attrs):
        cart = generics.get_object_or_404(models.Cart, id=attrs["cart"])
        self.context["cart"] = cart
        return attrs

    @db_transaction.atomic
    def save(self):
        cart = self.context["cart"]
        user = self.context.get("user")
        self.validated_data.pop("cart")
        data = service.CoreService.create_order(
            **self.validated_data, cart=cart, user=user
        )

        return data


class OrderPaymentInitailizeSerializer(serializers.Serializer):
    def validate(self, attrs):
        order: models.Order = self.context["order"]
        if (
            order.status >= models.OrderStatus.PAID
            or order.payment_method != models.OrderPaymentMethod.CARD
            or order.paid
        ):
            raise serializers.ValidationError({"details": "Cannot Initialize Payment"})
        return attrs

    def save(self):
        order: models.Order = self.context["order"]
        transaction: models.Transaction = service.CoreService.initialize_order_payment(
            order
        )
        return {
            "ref": transaction.ref,
            "order": order.id,
            "payment_method": order.payment_method,
            "amount": order.total_price,
            "key": settings.PAYSTACK_PUBLIC_KEY,
            "email": order.email,
        }


class OrderPaymentVerfiySerializer(serializers.Serializer):
    ref = serializers.CharField()

    def validate(self, attrs):
        transaction: models.Transaction = generics.get_object_or_404(
            models.Transaction, ref=attrs["ref"]
        )
        if transaction.status != models.TransactionStatus.INITAILIZED:
            raise serializers.ValidationError(
                {"detail": "Transaction is invalid"}
            )
        if not isinstance(transaction.object, models.Order):
            raise serializers.ValidationError({"detail": "Invalid tx for order"})
        if transaction.object.status >= models.OrderStatus.PAID:
            raise serializers.ValidationError({"detail": "Order is already Paid for"})
        verification = service.CoreService.verify_order_payment(transaction)
        if not verification:
            raise serializers.ValidationError(
                {"detail": "Order payment verification failed"}
            )
        self.context["order"] = models.Order.objects.get(id=transaction.object_id)
        return attrs

    @db_transaction.atomic
    def save(self):
        order: models.Order = self.context["order"]
        order.paid = True
        order.status = models.OrderStatus.PAID
        order.save()


class ConsultationSerializer(serializers.ModelSerializer):
    user = SimpleUserSerializer()
    doctor = DoctorSerializer()
    location = serializers.SerializerMethodField()

    class Meta:
        model = models.Consultation
        exclude = ["transaction"]

    def get_location(self, obj):
        if obj.status == models.ConsultationStatus.PAID:
            return obj.details

        return None


class ConsultationCreateSerializer(serializers.ModelSerializer):
    duration = serializers.IntegerField(default=1)

    class Meta:
        model = models.Consultation
        fields = ["doctor", "day", "start_time", "note", "duration"]

    def validate(self, attrs):
        check = service.CoreService.check_doctor_available(
            attrs["doctor"], attrs["day"], attrs["start_time"], attrs["duration"]
        )
        if not check:
            raise exceptions.DoctorNotAvailable
        return attrs

    @db_transaction.atomic
    def create(self, validated_data):
        consult = service.CoreService.book_consult(
            validated_data["doctor"],
            validated_data["day"],
            validated_data["start_time"],
            validated_data["duration"],
            validated_data["note"],
            self.context["user"],
        )
        service.NotificationService.send_consulation_creation_notification(consult)
        return consult


class ConsultationPaySerializer(serializers.Serializer):
    consultation = serializers.UUIDField()

    def validate(self, attrs):
        consultation: models.Consultation = generics.get_object_or_404(
            models.Consultation, id=attrs["consultation"]
        )
        if consultation.status != models.ConsultationStatus.ACCEPTED:
            raise serializers.ValidationError(
                {
                    "detail": "Consultation payment cannot be initialized without consultation being accepted"
                }
            )
        self.context["consultation"] = consultation
        return attrs

    def save(self):
        consultation = self.context["consultation"]
        data = service.CoreService.initialize_consultation_payment(consultation)
        return data


class ConsultationPaymentVerifySerializer(serializers.Serializer):
    ref = serializers.CharField()

    def validate(self, attrs):
        transaction: models.Transaction = generics.get_object_or_404(
            models.Transaction, ref=attrs["ref"]
        )
        if transaction.status != models.TransactionStatus.INITAILIZED:
            raise serializers.ValidationError(
                {"detail": "Transaction is invalid"}
            )
        if not isinstance(transaction.object, models.Consultation):
            raise serializers.ValidationError({"detail": "Invalid tx for consultation"})
        if transaction.object.status >= models.ConsultationStatus.PAID:
            raise serializers.ValidationError(
                {"detail": "Consultation is already Paid for"}
            )
        verification = service.CoreService.verify_consultation_payment(transaction)
        if not verification:
            raise serializers.ValidationError(
                {"detail": "Consultaton payment verification failed"}
            )
        self.context["consultation"] = models.Consultation.objects.get(
            id=transaction.object_id
        )
        return attrs

    @db_transaction.atomic
    def save(self):
        consultation: models.Consultation = self.context["consultation"]
        consultation.status = models.ConsultationStatus.PAID
        consult = consultation.save()
        service.NotificationService.send_consultation_payment_notification(consultation)
        data = ConsultationSerializer(consult).data
        return data
