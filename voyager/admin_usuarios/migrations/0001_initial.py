# Generated by Django 2.2.5 on 2019-10-09 22:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Rol',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=20)),
            ],
        ),
        migrations.CreateModel(
            name='IFCUsuario',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=30)),
                ('apellido_paterno', models.CharField(max_length=30)),
                ('apellido_materno', models.CharField(max_length=30)),
                ('telefono', models.CharField(max_length=15)),
                ('puesto', models.CharField(max_length=20)),
                ('estado', models.BooleanField(default=True)),
                ('rol', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='admin_usuarios.Rol')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
