from django.db import models



class OrdenInterna(models.Model):
    idOI = models.AutoField(primary_key=True)
    # empresa = models.Foreign
    # id_usuario = models.Foreign
    fecha_muestreo = models.DateField(blank=True)
    fechah_recibo = models.DateTimeField(blank=True)
    link_resultados = models.CharField(max_length=300, blank=True)
    fecha_muestreo = models.DateField(blank=True)
    guia_envio = models.CharField(max_length=50, blank=True)
    estatus = models.CharField(max_length=15, blank=True)

    SN = (
        ('Sí', 'Sí'),
        ('No', 'No'),
    )
    IDIOMA = (
        ('8809 ES', '8809 ES'),
        ('8992 EN', '8992 EN'),
    )
    formato_ingreso_muestra = models.CharField(max_length=2, choices=SN, blank=True)
    idioma_reporte = models.CharField(max_length=2, choices=IDIOMA, blank=True)
    mrl = models.CharField(max_length=200, blank=True)
    fecha_eri = models.DateField(blank=True)
    notif_e = models.CharField(max_length=2, choices=SN, blank=True)
    fecha_lab = models.DateField(blank=True)
    fecha_ei = models.DateField(blank=True)
    envio_ti = models.CharField(max_length=2, choices=SN, blank=True)
    cliente_cr = models.CharField(max_length=2, choices=SN, blank=True)

    resp_pago = models.CharField(max_length=50, blank=True)
    correo = models.EmailField(max_length=2, blank=True)
    telefono = models.CharField(max_length=13)
    

    class Meta:
        verbose_name = 'Orden Interna'
        verbose_name_plural = 'Órdenes Internas'

    def __str__(self):
        return "%s %s" % (self.idOI, self.estatus)
