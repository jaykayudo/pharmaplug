import datetime

from django.db import models
from django.core.exceptions import ValidationError

from core import models as core_models


class Schedule(core_models.BaseModel):
    doctor = models.ForeignKey(core_models.Doctor, on_delete=models.CASCADE)
    day = models.IntegerField(
        default=core_models.Days.MONDAY, choices=core_models.Days.choices
    )
    start_time = models.TimeField(default=datetime.time(9, 0, 0))
    end_time = models.TimeField(default=datetime.time(17, 0, 0))

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=models.Q(start_time__lt=models.F("end_time")),
                name="check_start_less_than_end",
            ),
            models.UniqueConstraint(
                fields=["day", "doctor"], name="unique_doctor_to_day"
            ),
        ]

    @property
    def day_choices_as_dict(self):
        days_dict = {}
        for day_int, day_str in core_models.Days.choices:
            days_dict[day_int] = day_str
        return days_dict

    def clean(self):
        if self.start_time <= self.end_time:
            raise ValidationError("start time must be less than end time.")

    def save(self, *args, **kwargs):
        self.full_clean()
        return super().save(*args, **kwargs)
