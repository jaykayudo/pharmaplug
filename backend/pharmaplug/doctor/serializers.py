from rest_framework import serializers, generics
from django.db import transaction as db_transaction
from core import models
from core import serializers as core_serializers
from core import service as core_service

from . import models as doctor_models, service, utils


class CustomStringRelatedField(serializers.RelatedField):
    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return data


class DoctorSerializer(serializers.ModelSerializer):
    user = core_serializers.SimpleUserSerializer()
    field = CustomStringRelatedField(queryset=models.DoctorCategory.objects.all())

    class Meta:
        model = models.Doctor
        fields = "__all__"

    def validate(self, attrs):
        if attrs.get("field"):
            field = generics.get_object_or_404(models.DoctorCategory, pk=attrs["field"])
            attrs["field"] = field
        return attrs

    @db_transaction.atomic
    def update(self, instance, validated_data):
        user = instance.user
        serializer = core_serializers.SimpleUserSerializer(
            user, data=validated_data["user"], partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()
        instance.field = validated_data.get("field", instance.field)
        instance.save()
        return instance


class ConsultationSerializer(serializers.ModelSerializer):
    user = core_serializers.SimpleUserSerializer()

    class Meta:
        model = models.Consultation
        fields = "__all__"


class WalletSerializer(serializers.ModelSerializer):
    user = core_serializers.SimpleUserSerializer()

    class Meta:
        model = models.Wallet
        fields = "__all__"


class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.WalletTransaction
        fields = "__all__"


class ScheduleSerializer(serializers.ModelSerializer):
    class Meta:
        model = doctor_models.Schedule
        fields = "__all__"
        read_only_fields = ["doctor"]


class ConsultationAcceptSerializer(serializers.Serializer):
    consultation = serializers.UUIDField()

    def validate(self, attrs):
        doctor = self.context["doctor"]
        try:
            consultation = models.Consultation.objects.get(
                id=attrs["consultation"], doctor=doctor
            )
        except models.Consultation.DoesNotExist:
            raise serializers.ValidationError(
                {"details": "Consultation does not exist"}, code=404
            )
        if consultation.status != models.ConsultationStatus.PENDING:
            raise serializers.ValidationError(
                {"details": "Consultation already accepted"}
            )
        consult = service.DoctorService.has_active_consult(
            doctor,
            consultation.day,
            consultation.start_time,
            consultation.end_time,
            exclude=consultation,
        )
        choices = utils.convert_choices_to_dict(models.ConsultationStatus.choices)
        if consult:
            raise serializers.ValidationError(
                {
                    "Detail": f"You have a consult with status `{choices[consult.status]}` by this period."
                }
            )
        self.context["consultation"] = consultation
        return attrs

    def save(self):
        consultation = self.context["consultation"]
        consultation.status = models.ConsultationStatus.ACCEPTED
        consultation.save()
        consult_user: models.User = consultation.user
        core_service.NotificationService.send_consulation_acceptance_notification(
            consultation
        )
        data = ConsultationSerializer(consultation).data
        return data


class ConsultationRescheduleSerializer(serializers.Serializer):
    consultation = serializers.UUIDField()
    day = serializers.DateField()
    start_time = serializers.TimeField()
    end_time = serializers.TimeField()

    def validate(self, attrs):
        doctor = self.context["doctor"]
        try:
            consultation = models.Consultation.objects.get(
                id=attrs["consultation"], doctor=doctor
            )
        except models.Consultation.DoesNotExist:
            raise serializers.ValidationError(
                {"details": "Consultation does not exist"}, code=404
            )
        consult = service.DoctorService.has_active_consult(
            doctor, attrs["day"], attrs["start_time"], attrs["end_time"]
        )
        choices = utils.convert_choices_to_dict(models.ConsultationStatus.choices)
        if consult:
            raise serializers.ValidationError(
                {
                    "Detail": f"You have a consult with status `{choices[consult.status]}` by this period."
                }
            )
        self.context["consultation"] = consultation
        return attrs

    def save(self):
        consultation: models.Consultation = self.context["consultation"]
        consultation.day = self.validated_data["day"]
        consultation.start_time = self.validated_data["start_time"]
        consultation.end_time = self.validated_data["end_time"]
        consultation.save()
        core_service.NotificationService.send_consulation_rescheduled_notification(
            consultation
        )
        data = ConsultationSerializer(consultation).data
        return data


class ConsultationRejectSerializer(serializers.Serializer):
    consultation = serializers.UUIDField()
    reason = serializers.CharField()

    def validate(self, attrs):
        doctor = self.context["doctor"]
        try:
            consultation = models.Consultation.objects.get(
                id=attrs["consultation"], doctor=doctor
            )
        except models.Consultation.DoesNotExist:
            raise serializers.ValidationError(
                {"details": "Consultation does not exist"}, code=404
            )
        self.context["consultation"] = consultation
        return attrs

    def save(self):
        consultation: models.Consultation = self.context["consultation"]
        consultation.details = self.validated_data["reason"]
        consultation.status = models.ConsultationStatus.REJECTED
        consultation.save()
        core_service.NotificationService.send_consulation_rejection_notification(
            consultation
        )
        data = ConsultationSerializer(consultation).data
        return data
