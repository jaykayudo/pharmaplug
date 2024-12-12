# Generated by Django 4.2 on 2024-12-12 01:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0004_alter_orderitem_order'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='delivery_method',
            field=models.IntegerField(choices=[(0, 'Home'), (1, 'Pickup station')], default=0),
            preserve_default=False,
        ),
    ]