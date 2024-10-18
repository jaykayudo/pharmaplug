from django.contrib import admin
from . import models
# Register your models here.

admin.site.register(models.User)
admin.site.register(models.DoctorCategory)
admin.site.register(models.Story)
admin.site.register(models.Doctor)
admin.site.register(models.Cart)
