# Generated by Django 2.2.5 on 2019-10-14 17:00

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('cuentas', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='ifcusuario',
            name='empresa',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='cuentas.Empresa'),
        ),
    ]
