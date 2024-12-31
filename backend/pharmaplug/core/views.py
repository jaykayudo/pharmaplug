from django.db.models import Q
from django.utils import timezone
from django.utils.decorators import method_decorator
from django.views.decorators.cache import cache_page
from django.views.decorators.vary import vary_on_cookie, vary_on_headers
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import generics, status


from . import serializers, models, service, utils


class FeaturedStoryAPIView(generics.ListAPIView):
    serializer_class = serializers.StorySerializer

    @method_decorator(cache_page(60 * 60 * 1))
    def get(self, request, *args, **kwargs):
        return super().get(request, *args, **kwargs)

    def get_queryset(self):
        return models.Story.objects.all().order_by("-updated_at")[:4]


class CommonDoctorCategoryListAPIView(generics.ListAPIView):
    serializer_class = serializers.DoctorCategorySerializer

    def get_queryset(self):
        return models.DoctorCategory.objects.all().order_by("-updated_at")[:6]


class DoctorCategoryListApiView(generics.ListAPIView):
    serializer_class = serializers.DoctorCategorySerializer

    def get_queryset(self):
        return models.DoctorCategory.objects.all()


class DoctorListAPIView(generics.ListAPIView):
    serializer_class = serializers.DoctorSerializer

    def get_queryset(self):
        kwargs = {}
        category = self.request.query_params.get("category")
        name = self.request.query_params.get("name")
        if name:
            full_name_list = name.rsplit(" ", maxsplit=2)
            if len(full_name_list) == 2:
                kwargs["user__first_name__istartswith"] = full_name_list[0]
                kwargs["user__last_name__istartswith"] = full_name_list[1]
            else:
                kwargs["user__first_name"] = full_name_list[0]

        if category:
            if utils.check_uuid_validity(category):
                kwargs["field__id"] = category
        data = models.Doctor.objects.filter(**kwargs)
        return data


class DoctorDetailsAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.DoctorSerializer
    queryset = models.Doctor.objects.filter(user__is_active=True)


class DoctorCheckScheduleAPIView(generics.GenericAPIView):
    serializer_class = serializers.DoctorVerifySchedule

    def get(self, request, pk):
        doctor = generics.get_object_or_404(models.Doctor, pk=pk)
        serializer = self.serializer_class(
            data=request.query_params, context={"doctor": doctor}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class DoctorConsultFeeAPIView(generics.GenericAPIView):
    serializer_class = serializers.DoctorConsultFeeSerializer

    def get(self, request, pk):
        doctor = generics.get_object_or_404(models.Doctor, pk=pk)
        serializer = self.serializer_class(
            data=request.query_params, context={"doctor": doctor}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class CommonSicknessListAPIView(generics.ListAPIView):
    serializer_class = serializers.SicknessSerializer

    def get_queryset(self):
        return models.Sickness.objects.filter(common=True).order_by("-updated_at")[:6]


class SicknessListAPIView(generics.ListAPIView):
    serializer_class = serializers.SicknessSerializer

    def get_queryset(self):
        kwargs = {}
        letter_filter = self.request.query_params.get("q")
        if letter_filter:
            kwargs["name__istartwith"] = letter_filter
        return models.Sickness.objects.filter(**kwargs).order_by("name")


class SicknessDetailsAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.SicknessSerializer
    queryset = models.Sickness.objects.all()


class SicknessDrugListAPIView(generics.ListAPIView):
    serializer_class = serializers.ProductSerializer

    def get_queryset(self):
        sickness = generics.get_object_or_404(models.Sickness, id=self.kwargs["id"])
        return models.Product.objects.filter(sicknesses=sickness)


class DrugSearchListAPIView(generics.ListAPIView):
    serializer_class = serializers.ProductSerializer

    def get_queryset(self):
        name = self.request.query_params.get("name")
        sickness = self.request.query_params.get("sickness")
        drugs = models.Product.objects.all()
        if name:
            drugs = drugs.filter(Q(name__icontains=name))
        if sickness:
            if utils.check_uuid_validity(sickness):
                drugs = drugs.filter(sicknesses__id=sickness)
        # return drugs.order_by("name").distinct("id") # use distinct when using postgres db
        return drugs.order_by("name")


class DrugDetailsAPIView(generics.RetrieveAPIView):
    serializer_class = serializers.ProductSerializer
    queryset = models.Product.objects.all()


class DrugAlternativeAPIView(generics.GenericAPIView):
    serializer_class = serializers.ProductSerializer

    def get(self, request, pk):
        drug = generics.get_object_or_404(models.Product, pk=pk)
        alternatives = service.CoreService.get_alternative_drug(drug)
        data = self.serializer_class(alternatives, many=True).data
        return Response(data)


class CartAPIView(generics.GenericAPIView):
    serializer_class = serializers.CartSerializer

    def get(self, request, pk):
        cart = generics.get_object_or_404(models.Cart, pk=pk)
        data = self.serializer_class(cart).data
        return Response(data)


class AddToCartAPIView(generics.GenericAPIView):
    serializer_class = serializers.AddToCartSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={"user": request.user if request.user.is_authenticated else None},
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class DeleteFromCartAPIView(generics.GenericAPIView):
    serializer_class = serializers.DeleteFromCartSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartIncreaseQuantityAPIView(generics.GenericAPIView):
    serializer_class = serializers.CartIncreaseQuantitySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CartDecreaseQuantityAPIView(generics.GenericAPIView):
    serializer_class = serializers.CartDecreaseQuantitySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class RetrieveDoctorScheduleAPIView(generics.GenericAPIView):
    pass


class CheckoutAPIView(generics.GenericAPIView):
    serializer_class = serializers.CheckoutSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data,
            context={"user": request.user} if request.user.is_authenticated else {},
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class OrderPaymentVerificationAPIView(generics.GenericAPIView):
    serializer_class = serializers.OrderPaymentVerfiySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


# All Authentication Process Views


class LoginAPIView(generics.GenericAPIView):
    serializer_class = serializers.LoginSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class GoogleLoginAPIView(generics.GenericAPIView):
    serializer_class = serializers.GoogleLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class RegisterAPIView(generics.GenericAPIView):
    serializer_class = serializers.UserSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        # log user in
        return Response(data)


class DoctorRegisterAPIView(generics.GenericAPIView):
    serializer_class = serializers.DoctorUserCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class GoogleRegisterAPIView(generics.GenericAPIView):
    serializer_class = serializers.GoogleRegisterSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        # log user in
        return Response(data)


class ForgotPasswordAPIView(generics.GenericAPIView):
    serializer_class = serializers.ForgotPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class CodeVerifyAPIView(generics.GenericAPIView):
    serializer_class = serializers.CodeVerifySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        return Response(status=status.HTTP_204_NO_CONTENT)


class ResetPasswordAPIView(generics.GenericAPIView):
    serializer_class = serializers.ResetPasswordSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


class VerifyEmailAPIView(generics.GenericAPIView):
    serializer_class = serializers.VerifyEmailSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(status=status.HTTP_204_NO_CONTENT)


# Authenticated Users Views


class DashboardDataAPIView(generics.GenericAPIView):
    @method_decorator(cache_page(60 * 15))
    @method_decorator(vary_on_headers("Authorization"))
    def get(self, request):
        all_orders = models.Order.objects.filter(user=request.user)
        medications = sum([order.item_count for order in all_orders])
        all_consultation = models.Consultation.objects.filter(user=request.user).count()
        upcoming_consultation = (
            models.Consultation.objects.filter(
                day__gt=timezone.now().date(),
                start_time__gt=timezone.now().time(),
                user=request.user,
            )
            .order_by("day", "start_time")
            .first()
        )

        context = {"medications": medications, "consultations": all_consultation}
        if upcoming_consultation:
            data = serializers.ConsultationSerializer(upcoming_consultation).data
            context["upcoming_consultation"] = data

        return Response(context)


class ChangePasswordApiView(generics.GenericAPIView):
    """
    View to change user's current password

    payload:
    - old_password (the current password of the user)
    - new_password (the new password)
    - confirm_new_password (the confirmation of the new password)
    """

    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ChangePasswordSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        user = serializer.save(request.data)
        return Response({"message": "Password Updated"})


class ProfileRetrieveUpdateAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)

    def post(self, request):
        serializer = self.serializer_class(
            request.user, data=request.data, partial=True, context={"request": request}
        )

        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class MergeCartAPIView(generics.GenericAPIView):
    """
    This view is called when the user logs is.
    is merges the cart of the current system the
    user's open cart.
    """

    permission_classes = [IsAuthenticated]
    serializer_class = serializers.MergeCartSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class BookConsultationAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ConsultationCreateSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(serializer.data)


class OrderHistoryAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.OrderSerializer

    def get_queryset(self):
        return models.Order.objects.filter(user=self.request.user).order_by("status")


class ConsultationHistoryAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ConsultationSerializer

    def get_queryset(self):
        return models.Consultation.objects.filter(user=self.request.user).order_by(
            "status"
        )


class ConsultationDetailsAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.ConsultationSerializer

    def get_object(self):
        pk = self.kwargs["pk"]
        user = self.request.user
        obj = generics.get_object_or_404(models.Consultation, pk=pk, user=user)
        return obj


class OrderDetailsAPIView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.OrderSerializer

    def get_object(self):
        pk = self.kwargs["pk"]
        user = self.request.user
        obj = generics.get_object_or_404(models.Order, pk=pk, user=user)
        return obj


class OrderReceiptAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        order = generics.get_object_or_404(models.Order, pk=pk, user=request.user)
        data = service.CoreService.get_order_reciept(order)
        file_name = data["file_name"]
        file = data["file"]
        response = Response(file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{file_name}"'
        return response


class OrderPaymentInitializeAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.OrderPaymentInitailizeSerializer

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class OrderPaymentVerifyAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.OrderPaymentVerfiySerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class ConsultationPayAPIView(generics.GenericAPIView):
    serializer_class = serializers.ConsultationPaySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class ConsultationPaymentVerificatoinAPIView(generics.GenericAPIView):
    serializer_class = serializers.ConsultationPaymentVerifySerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = self.serializer_class(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class ConsultationRecieptAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        consultation = generics.get_object_or_404(
            models.Consultation, pk=pk, user=request.user
        )
        data = service.CoreService.get_consultation_reciept(consultation)
        file_name = data["file_name"]
        file = data["file"]
        response = Response(file, content_type="application/pdf")
        response["Content-Disposition"] = f'attachment; filename="{file_name}"'
        return response


class NotificationListAPIView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.NotificationSerializer

    def get_queryset(self):
        return service.CoreService.get_user_notifications(self.request.user)


class NotificationReadAPIView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        notification: models.Notification = generics.get_object_or_404(
            models.Notification, pk=pk, user=request.user
        )
        notification.read = True
        notification.save()
        return Response(status=status.HTTP_204_NO_CONTENT)
