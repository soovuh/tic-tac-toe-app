# Generated by Django 4.2.5 on 2023-09-20 14:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='game',
            name='winner',
            field=models.CharField(default='n', max_length=1),
        ),
    ]
