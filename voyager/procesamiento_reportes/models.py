from django.db import models



class OrdenInterna(models.Model):
    #Orden interna
    idOI = models.AutoField(primary_key=True)
    # empresa = models.Foreign
    # id_usuario = models.Foreign
    fecha_muestreo = models.DateField(null=True, blank=True)
    localidad = models.CharField(max_length=50, blank=True)
    fechah_recibo = models.DateTimeField(null=True, blank=True)
    fecha_envio = models.DateField(null=True, blank=True)
    link_resultados = models.CharField(max_length=300, blank=True)
    guia_envio = models.CharField(max_length=50, blank=True)
    estatus = models.CharField(max_length=15, blank=True)

    #Opciones de sí/no e idioma
    SN = (
        ('Sí', 'Sí'),
        ('No', 'No'),
    )
    IDIOMA = (
        ('8809 ES', '8809 ES'),
        ('8992 EN', '8992 EN'),
    )

    #Observaciones
    formato_ingreso_muestra = models.CharField(max_length=2, choices=SN, blank=True)
    idioma_reporte = models.CharField(max_length=2, choices=IDIOMA, blank=True)
    mrl = models.CharField(max_length=200, blank=True) 
    fecha_eri = models.DateField(null=True, blank=True) #fecha esperada de recibo de informes
    notif_e = models.CharField(max_length=2, choices=SN, blank=True) #notificación de envío
    fecha_lab = models.DateField(null=True, blank=True) #fecha de llegada al lab
    fecha_ei = models.DateField(null=True, blank=True) #fecha de envio de informes
    envio_ti = models.CharField(max_length=2, choices=SN, blank=True) #envio de todos los informes
    cliente_cr = models.CharField(max_length=2, choices=SN, blank=True) #cliente confirmó de recibido

    #Info general factura
    resp_pago = models.CharField(max_length=50, blank=True)
    correo = models.EmailField(max_length=2, blank=True)
    telefono = models.CharField(max_length=13, blank=True)


    class Meta:
        verbose_name = 'Orden Interna'
        verbose_name_plural = 'Órdenes Internas'

    def __str__(self):
        return "%s %s" % (self.idOI, self.estatus)
