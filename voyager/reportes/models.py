from django.db import models
from cuentas.models import IFCUsuario
from ventas.models import Factura
from datetime import datetime, date
from django.utils import timezone

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
    fecha_recepcion_m = models.DateField(null=True, blank=True)
    fecha_envio = models.DateField(null=True, blank=True)
    fecha_llegada_lab = models.DateField(null=True, blank=True)
    link_resultados = models.CharField(max_length=300, blank=True)
    guia_envio = models.CharField(max_length=50, blank=True)
    paquete = models.ForeignKey(Paquete, blank=True, on_delete=models.DO_NOTHING, null=True)

    #Opciones de sí/no e idioma
    SN = (
        ('Sí', 'Sí'),
        ('No', 'No'),
    )
    IDIOMA = (
        ('Español', 'Español'),
        ('Inglés', 'Inglés'),
    )
    ESTADOS = (
        ('Invisible', 'Invisible'),
        ('Fantasma', 'Fantasma'),
        ('Creada', 'Creada'),
        ('Enviada', 'Enviada'),
        ('En laboratorio', 'En laboratorio'),
        ('Resultados', 'Resultados'),
        ('Borrado', 'Borrado'),
    )

    pagado = models.CharField(max_length=2, choices=SN, default="No")
    formato_ingreso_muestra = models.CharField(max_length=2, choices=SN, blank=True)
    estatus = models.CharField(max_length=15, choices=ESTADOS, blank=True)
    #Observaciones
    idioma_reporte = models.CharField(max_length=20, choices=IDIOMA, blank=True)
    observaciones = models.TextField(blank=True)

    class Meta:
        verbose_name = 'Orden Interna'
        verbose_name_plural = 'Órdenes Internas'

    def __str__(self):
        return "%s %s" % (self.idOI, self.estatus)

######### MODEL USV04-04 ########
class Pais(models.Model):
    id_pais = models.AutoField(primary_key=True)
    nombre = models.CharField(max_length=50)

    def __str__(self):
        return "%s" % (self.nombre)


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

class Nota(models.Model):
    id_nota = models.AutoField(primary_key=True)
    descripcion = models.CharField(max_length=100)
    analisis = models.ForeignKey(Analisis,on_delete=models.CASCADE, related_name='analisis')
    def __str__(self):
        return "%s" % (self.descripcion)

######### MODEL USV04-04 ########

class Muestra(models.Model):
    id_muestra = models.AutoField(primary_key=True) #1-Número de muestra
    usuario = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE) #No visible
    oi = models.ForeignKey(OrdenInterna,on_delete=models.CASCADE) #No visible
    producto = models.CharField(max_length=50) #2-Producto
    variedad = models.CharField(max_length=50) #2.5 Variedad
    pais_origen = models.CharField(max_length=50) #--------------PENDIENTE DE VISIBILIDAD
    codigo_muestra = models.CharField(max_length=50) #3-Código muestra
    mrl = models.CharField(max_length=200, blank=True) #5-MRL
    ubicacion = models.CharField(max_length=75)#--------------PENDIENTE DE VISIBILIDAD
    estado = models.CharField(max_length=20)#--------------PENDIENTE DE VISIBILIDAD
    parcela = models.CharField(max_length=50)#--------------PENDIENTE DE VISIBILIDAD
    fecha_muestreo = models.DateField()#--------------PENDIENTE DE VISIBILIDAD
    destino = models.CharField(max_length=50)#--------------PENDIENTE DE VISIBILIDAD
    idioma = models.CharField(max_length=20)#--------------PENDIENTE DE VISIBILIDAD
    estado_muestra = models.BooleanField()#--------------PENDIENTE DE VISIBILIDAD
    num_interno_informe = models.CharField(max_length=50, null=True, blank=True)#6-Número interno de informe
    fechah_recibo = models.DateTimeField(null=True, blank=True)#7-Fecha de recibo de informe
    fecha_eri = models.DateTimeField(null=True, blank=True)#8-Fecha esperada de recibo de informes
    muestreador = models.CharField(max_length=50) #9-Muestreador
    fecha_forma = models.DateField()#--------------PENDIENTE DE VISIBILIDAD
    factura = models.ForeignKey(Factura,on_delete=models.CASCADE, null=True, blank=True) #factura
    orden_compra = models.CharField(max_length=50, null=True, blank=True) #orden de compra
    #Opciones de sí/no
    SN = (
        ('Sí', 'Sí'),
        ('No', 'No'),
    )
    enviado = models.CharField(max_length=2, choices=SN, default="No")#10-Enviado
    link_resultados =  models.CharField(max_length=100, default="")



class Cotizacion(models.Model):
    id_cotizacion = models.AutoField(primary_key=True)
    usuario_c = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE, related_name='cliente')
    usuario_v = models.ForeignKey(IFCUsuario,on_delete=models.CASCADE, related_name='ventas')
    envio = models.DecimalField(max_digits=100, decimal_places=2)
    subtotal = models.DecimalField(max_digits=100, decimal_places=2)
    total = models.DecimalField(max_digits=100, decimal_places=2)
    status = models.BooleanField(default=True)
    aceptado = models.BooleanField(default=False)
    fecha_creada = models.DateField(default=timezone.now)

    class Meta:
        verbose_name = 'Cotización'
        verbose_name_plural = 'Cotizaciones'

    def __str__(self):
        return "%s %s" % (self.id_cotizacion, self.usuario_c.user.username)

class AnalisisCotizacion(models.Model):
    id_analisis_cotizacion = models.AutoField(primary_key=True)
    analisis = models.ForeignKey(Analisis,on_delete=models.CASCADE)
    cotizacion = models.ForeignKey(Cotizacion,on_delete=models.CASCADE)
    cantidad = models.IntegerField()
    fecha = models.DateField()
    descuento = models.DecimalField(max_digits=100, decimal_places=4, default=0)
    iva = models.DecimalField(max_digits=100, decimal_places=2, default=16)
    total = models.DecimalField(max_digits=100, decimal_places=2, default=0)

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
