from django.db import models

# Create your models here.


class Factura(models.Model):
    idFactura = models.AutoField(primary_key=True)
