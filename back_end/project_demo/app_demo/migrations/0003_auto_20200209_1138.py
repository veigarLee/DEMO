# Generated by Django 3.0.2 on 2020-02-09 11:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('app_demo', '0002_customermodel'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customermodel',
            name='age',
            field=models.IntegerField(),
        ),
    ]
