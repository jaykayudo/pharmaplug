# Generated by Django 4.2 on 2024-12-28 15:08

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0008_remove_order_transaction'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='consultation',
            name='transaction',
        ),
    ]