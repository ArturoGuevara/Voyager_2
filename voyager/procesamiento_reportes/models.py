from django.db import models
from admin_usuarios.models import IFCUsuario

# Create your models here.
class OrdenInterna(models.Model):
    id_oi = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE)
    localidad = models.CharField(max_length=50)
    fecha_muestreo = models.DateField()
    fecha_recibo = models.DateField()
    link_resultados = models.CharField(max_length=75)
    fecha_envio = models.DateField()
    guia_envio = models.CharField(max_length=50)
    status = models.IntegerField()

class Muestra(models.Model):
    id_muestra = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE)
    oi = models.ForeignKey(OrdenInterna,on_delete=models.CASCADE)
    producto = models.CharField(max_length=50)
    variedad = models.CharField(max_length=50)
    pais_origen = models.CharField(max_length=50)
    codigo_muestra = models.CharField(max_length=50)
    codigo_interno = models.CharField(max_length=50)
    agricultor = models.CharField(max_length=50)
    ubicacion = models.CharField(max_length=75)
    estado = models.CharField(max_length=20)
    parcela = models.CharField(max_length=50)
    fecha_muestreo =  models.DateField()
    destino = models.CharField(max_length=50)
    idioma = models.CharField(max_length=20)
    estado_muestra = models.BooleanField()