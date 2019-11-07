from django.db import models

# Create your models here.
class Factura(models.Model):
    idFactura = models.AutoField(primary_key=True)
    resp_pago = models.CharField(max_length=50, blank=True)
    correo = models.EmailField(max_length=50, blank=True)
    telefono = models.CharField(max_length=13, blank=True)