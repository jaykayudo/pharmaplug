from core import models
from django.db.models import Sum
from django.utils import timezone
from django.core.mail import send_mail


class DoctorService:
    @classmethod
    def all_transaction_amount(cls, wallet: models.Wallet):
        credit_transaction = models.WalletTransaction.objects.filter(
            wallet=wallet, type=models.WalletTransactionType.CREDIT
        ).values_list("amount", flat=True)
        return sum(credit_transaction)

    @classmethod
    def pending_consultation_num(cls, doctor: models.Doctor):
        consult_count = models.Consultation.objects.filter(
            doctor=doctor, status=models.ConsultationStatus.PENDING
        ).count()
        return consult_count

    @classmethod
    def all_consultation_num(cls, doctor: models.Doctor):
        consult_count = models.Consultation.objects.filter(
            doctor=doctor, status__gt=models.ConsultationStatus.PENDING
        ).count()
        return consult_count

    @classmethod
    def all_patient_num(cls, doctor: models.Doctor):
        # consult_count = (
        #     models.Consultation.objects.filter(
        #         doctor=doctor, status__gt=models.ConsultationStatus.PENDING
        #     )
        #     .distinct("user")
        #     .count()
        # )
        # distinct not supported in sqlite3.. NOTE: uncomment when you use postgres and remove below logic
        pending_consults = models.Consultation.objects.filter(
            doctor=doctor, status__gt=models.ConsultationStatus.PENDING
        )
        consults = []
        for consult in pending_consults:
            if consult.user_id not in consults:
                consults.append(consult)
        return len(consults)

    @classmethod
    def get_earn_stat(cls, doctor: models.Doctor):
        """
        data_format:[
        ("Jan",120000),("Feb",120000)
        ]
        """
        wallet = models.Wallet.objects.get(user=doctor.user)
        current_year = timezone.now().year
        data = (
            models.WalletTransaction.objects.filter(
                wallet=wallet,
                type=models.WalletTransactionType.CREDIT,
                created_at__year=current_year,
            )
            .values_list("created_at__month")
            .annotate(total_amount=Sum("amount"))
        )
        return data

    @classmethod
    def has_active_consult(cls, doctor, date, start_time, end_time, *, exclude=None):
        consults = models.Consultation.objects.filter(
            doctor=doctor, date=date, start_time=start_time
        )
        if exclude:
            consults = consults.exclude(id=exclude.id)
        if consults.exists():
            consult = consults.first()
            return consult
        else:
            return False


class EmailService:
    @classmethod
    def consultation_acceptance_email(
        cls, user: models.User, consultation: models.Consultation
    ):
        subject = f"Consultation Accepted"
        message = f"Your consultation with {consultation.doctor} has been accepted"
        send_mail(subject, message, recipient_list=[user.email], fail_silently=True)

    @classmethod
    def consultation_reschedule_email(cls, consultation: models.Consultation):
        subject = f"Consultation Reschedule"
        message = f"Your consultation with {consultation.doctor} has been rescheduled"
        send_mail(
            subject,
            message,
            recipient_list=[consultation.user.email],
            fail_silently=True,
        )
