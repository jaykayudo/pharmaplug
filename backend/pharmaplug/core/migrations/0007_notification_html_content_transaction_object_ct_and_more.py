# Generated by Django 4.2 on 2024-12-24 22:14

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('contenttypes', '0002_remove_content_type_name'),
        ('core', '0006_notification'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='html_content',
            field=models.TextField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='transaction',
            name='object_ct',
            field=models.ForeignKey(default=1, on_delete=django.db.models.deletion.CASCADE, to='contenttypes.contenttype'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transaction',
            name='object_id',
            field=models.UUIDField(default='123e4567-e89b-12d3-a456-426614174000'),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='transaction',
            name='type',
            field=models.CharField(choices=[('order', 'Order'), ('wallet', 'Wallet')], default='order', max_length=20),
            preserve_default=False,
        ),
    ]
