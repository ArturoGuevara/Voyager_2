from django.db import models
from django.contrib.auth.models import User

# Modelo de roles
class Rol(models.Model):
    nombre = models.CharField(max_length=20)


# IFCUser, es el usuario general, que se extiende de la libreria "User" de DjangoTemplates
class IFCUsuario(models.Model):
    # Llave foranea del rol al que pertenece
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)
    # Relacion uno a uno con User de Django
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    # Campos adicionales
    nombre = models.CharField(max_length = 30)
    apellido_paterno = models.CharField(max_length = 30)
    apellido_materno = models.CharField(max_length = 30)
    telefono = models.CharField(max_length = 15)
    puesto = models.CharField(max_length = 20)
    estado = models.BooleanField(default = True)
