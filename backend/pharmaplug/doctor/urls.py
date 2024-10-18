from django.urls import path
from . import views

app_name = "doctor"

urlpatterns = [
    path("profile/", views.DoctorProfileAPIView.as_view(), name="profile"),
    path("consults/", views.ConsultationListAPIView.as_view(), name="consults"),
    path(
        "consults/<uuid:pk>/",
        views.ConsultationDetailsAPIView.as_view(),
        name="consult_details",
    ),
    path(
        "consults/accept/",
        views.ConsultationAcceptAPIView.as_view(),
        name="consult_accept",
    ),
    path(
        "consults/reschedule/",
        views.ConsultationRescheduleAPIView.as_view(),
        name="consult_reschedule",
    ),
    path(
        "dashboard-stats/",
        views.DashboardStatisticsAPIView.as_view(),
        name="dashboard_stats",
    ),
    path(
        "earnings-stats/",
        views.EarningsChartStatisticsAPIView.as_view(),
        name="earning_stats",
    ),
    path("wallet/", views.WalletAPIVIew.as_view(), name="wallet"),
    path(
        "wallet/transactions/",
        views.WalletTransactionAPIView.as_view(),
        name="wallet_transactions",
    ),
    path(
        "wallet/earned-amount/",
        views.AllTransactionAmountAPIView.as_view(),
        name="wallet_earned_amount",
    ),
    path("schedules/", views.ScheduleListAPIView.as_view(), name="schedules"),
    path(
        "schedules/create/",
        views.ScheduleCreateAPIView.as_view(),
        name="schedules_create",
    ),
]
