from django.urls import path
from . import views

app_name = "core"

urlpatterns = [
    path("stories/", views.FeaturedStoryAPIView.as_view(), name="stories"),
    path(
        "common/doctor-categories/",
        views.CommonDoctorCategoryListAPIView.as_view(),
        name="common_doctor_categories",
    ),
    path(
        "common/sicknesses/",
        views.CommonSicknessListAPIView.as_view(),
        name="common_sicknesses",
    ),
    path(
        "doctor-categories/",
        views.DoctorCategoryListApiView.as_view(),
        name="doctor_categories",
    ),
    path("doctors/", views.DoctorListAPIView.as_view(), name="doctors"),
    path(
        "doctors/<uuid:pk>/",
        views.DoctorDetailsAPIView.as_view(),
        name="doctor_details",
    ),
    path(
        "doctors/<uuid:pk>/verify-schedule/",
        views.DoctorCheckScheduleAPIView.as_view(),
        name="doctor_verify_schedule",
    ),
    path(
        "doctors/<uuid:pk>/get-consult-fee/",
        views.DoctorConsultFeeAPIView.as_view(),
        name="doctor_consult_fee",
    ),
    path("sicknesses/", views.SicknessListAPIView.as_view(), name="sicknesses"),
    path(
        "sicknesses/<uuid:pk>/",
        views.SicknessDetailsAPIView.as_view(),
        name="sicknesses_details",
    ),
    path(
        "sicknesses/<uuid:id>/drugs/",
        views.SicknessDrugListAPIView.as_view(),
        name="sicknesses_drug",
    ),
    path("drugs/", views.DrugSearchListAPIView.as_view(), name="all_drugs"),
    path("drugs/<uuid:pk>/", views.DrugDetailsAPIView.as_view(), name="drug_details"),
    path(
        "drugs/<uuid:pk>/alternatives/",
        views.DrugAlternativeAPIView.as_view(),
        name="drug_alternatives",
    ),
    path("cart/add/", views.AddToCartAPIView.as_view(), name="cart_add"),
    path("cart/remove/", views.DeleteFromCartAPIView.as_view(), name="cart_remove"),
    path(
        "cart/increase-quantity/",
        views.CartIncreaseQuantityAPIView.as_view(),
        name="cart_increase_quantity",
    ),
    path(
        "cart/decrease-quantity/",
        views.CartDecreaseQuantityAPIView.as_view(),
        name="cart_decrease_quantity",
    ),
    path("cart/<uuid:pk>/", views.CartAPIView.as_view(), name="cart"),
    path("checkout/", views.CheckoutAPIView.as_view(), name="checkout"),
    path(
        "order-verify/",
        views.OrderPaymentVerificationAPIView.as_view(),
        name="order_pay_verify",
    ),
    # auth
    path("login/", views.LoginAPIView.as_view(), name="login"),
    path("login/google/", views.GoogleLoginAPIView.as_view(), name="login_google"),
    path("register/", views.RegisterAPIView.as_view(), name="register"),
    path(
        "register/google/",
        views.GoogleRegisterAPIView.as_view(),
        name="register_google",
    ),
    path(
        "register-doctor/",
        views.DoctorRegisterAPIView.as_view(),
        name="register_doctor",
    ),
    path("verify-email/", views.VerifyEmailAPIView.as_view(), name="verify_email"),
    path(
        "forgot-password/",
        views.ForgotPasswordAPIView.as_view(),
        name="forgot_password",
    ),
    path("verify-code/", views.CodeVerifyAPIView.as_view(), name="verify_code"),
    path(
        "reset-password/", views.ResetPasswordAPIView.as_view(), name="reset_password"
    ),
    path(
        "change-password/",
        views.ChangePasswordApiView.as_view(),
        name="change_password",
    ),
    # auth users
    path("dashboard/", views.DashboardDataAPIView.as_view(), name="dashboard"),
    path("merge-cart/", views.MergeCartAPIView.as_view(), name="merge_cart"),
    path("profile/", views.ProfileRetrieveUpdateAPIView.as_view(), name="profile"),
    path("book-consult/", views.BookConsultationAPIView.as_view(), name="book_consult"),
    path("orders/", views.OrderHistoryAPIView.as_view(), name="orders"),
    path(
        "orders/<uuid:pk>/", views.OrderDetailsAPIView.as_view(), name="orders_details"
    ),
    path(
        "orders/<uuid:pk>/receipt/",
        views.OrderReceiptAPIView.as_view(),
        name="orders_receipt",
    ),
    path(
        "orders/pay/",
        views.OrderPaymentInitializeAPIView.as_view(),
        name="orders_pay_initailize",
    ),
    path(
        "orders/pay_verify/",
        views.OrderPaymentVerificationAPIView.as_view(),
        name="orders_pay_verify",
    ),
    path(
        "consultations/",
        views.ConsultationHistoryAPIView.as_view(),
        name="consultations",
    ),
    path(
        "consultations/pay/",
        views.ConsultationPayAPIView.as_view(),
        name="consultations_pay",
    ),
    path(
        "consultations/pay_verify/",
        views.ConsultationPaymentVerificatoinAPIView.as_view(),
        name="consultations_pay_verify",
    ),
    path(
        "consultations/<uuid:pk>/",
        views.ConsultationDetailsAPIView.as_view(),
        name="consultations_details",
    ),
    path(
        "consultations/<uuid:pk>/receipt/",
        views.ConsultationRecieptAPIView.as_view(),
        name="consultations_receipt",
    ),
    path(
        "notifications/",
        views.NotificationListAPIView.as_view(),
        name="notifications",
    ),
    path(
        "notifications/<uuid:pk>/read/",
        views.NotificationReadAPIView.as_view(),
        name="notification_read",
    ),
]
