from django.db import models



class OrdenInterna(models.Model):
    idOI = models.AutoField(primary_key=True)
    # empresa = models.Foreign
    # id_usuario = models.Foreign
    fecha_muestreo = models.DateField()
    fechah_recibo = models.DateTimeField()
    link_resultados = models.CharField(max_length=300)
    fecha_muestreo = models.DateField()
    guia_envio = models.CharField(max_length=50)
    estatus = models.CharField(max_length=15)

    class Meta:
        verbose_name = 'Orden Interna'
        verbose_name_plural = 'Órdenes Internas'

    def __str__(self):
        return "%s %s" % (self.idOI, self.estatus)
