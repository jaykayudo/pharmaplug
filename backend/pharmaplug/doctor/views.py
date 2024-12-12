from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.response import Response

from core.permissions import IsDoctor
from . import serializers, service, models
from core import models as core_models


class DashboardStatisticsAPIView(generics.GenericAPIView):
    permission_classes = [IsDoctor]

    def get(self, request):
        doctor = request.user.doctor
        data = {
            "patient_num": service.DoctorService.all_patient_num(doctor),
            "all_consult_num": service.DoctorService.all_consultation_num(doctor),
            "pending_consult_num": service.DoctorService.all_consultation_num(doctor),
        }
        return Response(data)


class EarningsChartStatisticsAPIView(generics.GenericAPIView):
    permission_classes = [IsDoctor]

    def get(self, request):
        doctor = request.user.doctor
        data = service.DoctorService.get_earn_stat(doctor)
        return Response(data)


class DoctorProfileAPIView(generics.GenericAPIView):
    permission_classes = [IsDoctor]
    serializer_class = serializers.DoctorSerializer

    def get(self, request):
        data = self.serializer_class(request.user.doctor).data
        return Response(data)

    def post(self, request):
        serializer = self.serializer_class(
            request.user.doctor,
            data=request.data,
            partial=True,
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)


class ConsultationListAPIView(generics.ListAPIView):
    permission_classes = [IsDoctor]
    serializer_class = serializers.ConsultationSerializer

    def get_queryset(self):
        kwargs = {"doctor": self.request.user.doctor}
        consult_status = self.request.query_params.get("status")
        if consult_status:
            if consult_status.isdigit():
                kwargs["status"] = int(consult_status)
        return core_models.Consultation.objects.filter(**kwargs).order_by(
            "status", "-created_at"
        )


class ConsultationDetailsAPIView(generics.RetrieveAPIView):
    pagination_class = [IsDoctor]
    serializer_class = serializers.ConsultationSerializer

    def get_object(self):
        doctor = self.request.user.doctor
        pk = self.kwargs["pk"]
        consult = generics.get_object_or_404(
            core_models.Consultation, pk=pk, doctor=doctor
        )
        return consult


class ConsultationAcceptAPIView(generics.GenericAPIView):
    pagination_class = [IsDoctor]
    serializer_class = serializers.ConsultationAcceptSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class ConsultationRescheduleAPIView(generics.GenericAPIView):
    pagination_class = [IsDoctor]
    serializer_class = serializers.ConsultationRescheduleSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()
        return Response(data)


class WalletAPIVIew(generics.GenericAPIView):
    permission_classes = [IsDoctor]
    serializer_class = serializers.WalletSerializer

    def get(self, request):
        wallet = request.user.wallet
        serializer = self.serializer_class(wallet)
        return Response(serializer.data)


class AllTransactionAmountAPIView(generics.GenericAPIView):
    permission_classes = [IsDoctor]

    def get(self, request):
        wallet = request.user.wallet
        data = service.DoctorService.all_transaction_amount(wallet)
        return Response(data)


class WalletTransactionAPIView(generics.ListAPIView):
    permission_classes = [IsDoctor]
    serializer_class = serializers.WalletTransactionSerializer

    def get_queryset(self):
        wallet = self.request.user.wallet
        return core_models.WalletTransaction.objects.filter(wallet=wallet).order_by(
            "-created_at"
        )


class ScheduleListAPIView(generics.ListAPIView):
    permission_classes = [IsDoctor]
    serializer_class = serializers.ScheduleSerializer

    def get_queryset(self):
        doctor = self.request.user.doctor
        return models.Schedule.objects.filter(doctor=doctor).order_by("day")


class ScheduleCreateAPIView(generics.GenericAPIView):
    permission_classes = [IsDoctor]
    serializer_class = serializers.ScheduleSerializer

    def post(self, request):
        doctor = request.user.doctor
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(doctor=doctor)

        return Response(serializer.data)
