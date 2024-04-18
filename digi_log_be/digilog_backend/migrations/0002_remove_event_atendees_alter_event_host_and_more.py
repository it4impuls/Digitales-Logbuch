# Generated by Django 5.0.4 on 2024-04-18 08:08

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('digilog_backend', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='event',
            name='atendees',
        ),
        migrations.AlterField(
            model_name='event',
            name='host',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='digilog_backend.person'),
        ),
        migrations.AddField(
            model_name='event',
            name='atendees',
            field=models.ManyToManyField(blank=True, null=True, related_name='attends', to='digilog_backend.person'),
        ),
    ]
