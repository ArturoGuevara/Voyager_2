# Generated by Django 2.2.5 on 2019-10-07 17:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('procesamiento_reportes', '0002_auto_20191007_1221'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ordeninterna',
            name='fecha_muestreo',
            field=models.DateField(blank=True, null=True),
        ),
    ]