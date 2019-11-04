from django.db import models
from cuentas.models import IFCUsuario
from ventas.models import Factura
from datetime import datetime, date

class Paquete(models.Model):
    id_paquete = models.AutoField(primary_key=True)
    codigo_dhl = models.CharField(max_length=10,blank=True,null=True)
    def __str__(self):
        return "%s" % (self.codigo_dhl)


# Create your models here.
class OrdenInterna(models.Model):
    idOI = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE, default='')
    localidad = models.CharField(max_length=50, blank=True)
    fecha_envio = models.DateField(null=True, blank=True)
    link_resultados = models.CharField(max_length=300, blank=True)
    guia_envio = models.CharField(max_length=50, blank=True)
    paquete = models.ForeignKey(Paquete, blank=True, on_delete=models.DO_NOTHING, null=True)

    #Opciones de sí/no e idioma
    SN = (
        ('Sí', 'Sí'),
        ('No', 'No'),
    )
    IDIOMA = (
        ('8809 ES', '8809 ES'),
        ('8992 EN', '8992 EN'),
    )
    ESTADOS = (
        ('invisible', 'invisible'),
        ('fantasma', 'fantasma'),
        ('activo', 'activo'),
        ('borrado', 'borrado'),
    )

    #Observaciones
    formato_ingreso_muestra = models.CharField(max_length=2, choices=SN, blank=True)
    idioma_reporte = models.CharField(max_length=20, choices=IDIOMA, blank=True)
    mrl = models.CharField(max_length=200, blank=True)
    estatus = models.CharField(max_length=15, choices=ESTADOS, blank=True)
    fecha_eri = models.DateField(null=True, blank=True) #fecha esperada de recibo de informes
    notif_e = models.CharField(max_length=2, choices=SN, blank=True) #notificación de envío
    fecha_lab = models.DateField(null=True, blank=True) #fecha de llegada al lab
    fecha_ei = models.DateField(null=True, blank=True) #fecha de envio de informes
    envio_ti = models.CharField(max_length=2, choices=SN, blank=True) #envio de todos los informes
    cliente_cr = models.CharField(max_length=2, choices=SN, blank=True) #cliente confirmó de recibido

    class Meta:
        verbose_name = 'Orden Interna'
        verbose_name_plural = 'Órdenes Internas'

    def __str__(self):
        return "%s %s" % (self.idOI, self.estatus)

class Muestra(models.Model):
    id_muestra = models.AutoField(primary_key=True)
    usuario = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE)
    oi = models.ForeignKey(OrdenInterna,on_delete=models.CASCADE)
    producto = models.CharField(max_length=50)
    variedad = models.CharField(max_length=50)
    pais_origen = models.CharField(max_length=50)
    codigo_muestra = models.CharField(max_length=50)
    agricultor = models.CharField(max_length=50)
    ubicacion = models.CharField(max_length=75)
    estado = models.CharField(max_length=20)
    parcela = models.CharField(max_length=50)
    fecha_muestreo = models.DateField()
    destino = models.CharField(max_length=50)
    idioma = models.CharField(max_length=20)
    estado_muestra = models.BooleanField()
    num_interno_informe = models.CharField(max_length=50, null=True, blank=True)
    fechah_recibo = models.DateTimeField(null=True, blank=True)
    fecha_forma = models.DateField()
    factura = models.ForeignKey(Factura,on_delete=models.CASCADE, null=True, blank=True) #factura
    orden_compra = models.CharField(max_length=50, null=True, blank=True) #orden de compra



class Cotizacion(models.Model):
    id_cotizacion = models.AutoField(primary_key=True)
    usuario_c = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE, related_name='cliente')
    usuario_v = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE, related_name='ventas')
    descuento = models.DecimalField(max_digits=100, decimal_places=4)
    subtotal = models.DecimalField(max_digits=100, decimal_places=2)
    iva = models.DecimalField(max_digits=100, decimal_places=2)
    total = models.DecimalField(max_digits=100, decimal_places=2)
    status = models.BooleanField(default=True)
    fecha_creada = models.DateField(default=date.today())

    class Meta:
        verbose_name = 'Cotización'
        verbose_name_plural = 'Cotizaciones'

    def __str__(self):
        return "%s %s" % (self.id_cotizacion, self.usuario_c.user.username)

######### MODEL USV04-04 ########


class Pais(models.Model):
    id_pais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return "%s" % (self.nombre)

######### MODEL USV04-04 ########

class Analisis(models.Model):
    id_analisis = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=100, default='')
    codigo = models.CharField(max_length=50)
    descripcion = models.CharField(max_length=500)
    precio = models.DecimalField(max_digits=30,decimal_places=2)
    unidad_min = models.CharField(max_length=50, default='')
    tiempo = models.CharField(max_length=15) #numero de dias que toma el análisis
    pais = models.ForeignKey(Pais,on_delete=models.CASCADE, related_name='pais', default='')
    acreditacion = models.BooleanField(default=False)

    def __str__(self):
        return "%s %s" % (self.nombre, self.codigo)

######### MODEL USV04-04 ########


class Nota(models.Model):
    id_nota = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)
    analisis = models.ForeignKey(Analisis,on_delete=models.CASCADE, related_name='analisis')
    def __str__(self):
        return "%s" % (self.descripcion)


######### MODEL USV04-04 ########

class AnalisisCotizacion(models.Model):
    id_analisis_cotizacion = models.AutoField(primary_key=True)
    analisis = models.ForeignKey(Analisis,on_delete=models.CASCADE)
    cotizacion = models.ForeignKey(Cotizacion,on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    fecha = models.DateField()

    class Meta:
        verbose_name = 'Analisis Cotizacion'
        verbose_name_plural = 'Analisis Cotizaciones'

    def __str__(self):
        return "%s %s" % (self.fecha, self.id_analisis_cotizacion)

######### MODEL USV04-04 ########


class AnalisisMuestra(models.Model):
    id_analisis_muestra = models.AutoField(primary_key=True)
    analisis = models.ForeignKey(Analisis,on_delete=models.CASCADE)
    muestra = models.ForeignKey(Muestra,on_delete=models.CASCADE)
    estado = models.BooleanField()
    fecha = models.DateField()
    def __str__(self):
        return "%s" % (self.fecha)
