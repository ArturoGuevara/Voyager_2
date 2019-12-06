from django.db import models
from django.contrib.auth.models import User

# Modelo de roles
class Rol(models.Model):
    nombre = models.CharField(max_length=20)

    class Meta:
        verbose_name = 'Rol'
        verbose_name_plural = 'Roles'

    def __str__(self):
        return "%s" % (self.nombre,)


class Empresa (models.Model):
    empresa = models.CharField(max_length=50, null = True, blank = True)
    telefono = models.CharField(max_length=15, default="", null = True, blank = True)
    responsable_resultados = models.CharField(max_length=100, default="", null = True, blank = True)
    correo_resultados = models.EmailField(default="", null = True, blank = True)
    responsable_pagos = models.CharField(max_length=100, default="", null = True, blank = True)
    correo_pagos = models.EmailField(default="", null = True, blank = True)
    responsable_compras = models.CharField(max_length=100, default="", null = True, blank = True)
    correo_compras = models.EmailField(default="", null = True, blank = True)
    estado = models.BooleanField(default=True)

    class Meta:
        verbose_name = 'Empresa'
        verbose_name_plural = 'Empresas'

    def __str__(self):
        return "%s" % (self.empresa,)


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
    estado = models.BooleanField(default = True)
    empresa = models.ForeignKey(Empresa, on_delete=models.CASCADE, null=True)
    estatus_pago = models.CharField(max_length = 10,default = 'NA')

    class Meta:
        verbose_name = 'Usuario IFC'
        verbose_name_plural = 'Usuarios IFC'

    def __str__(self):
        return "%s %s %s" % (self.nombre, self.apellido_paterno, self.apellido_materno)


class Permiso(models.Model):
    idPermiso =  models.AutoField(primary_key=True)
    nombre = models.CharField(max_length = 50)

    class Meta:
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permisos'

    def __str__(self):
        return "%s" % (self.nombre)

class PermisoRol(models.Model):
    idPermisoRol = models.AutoField(primary_key=True)
    permiso = models.ForeignKey(Permiso, on_delete=models.CASCADE)
    rol = models.ForeignKey(Rol, on_delete=models.CASCADE)

    class Meta:
        verbose_name = 'Permiso'
        verbose_name_plural = 'Permiso Roles'

    def __str__(self):
        return "%s %s" % (self.permiso.nombre, self.rol.nombre)
