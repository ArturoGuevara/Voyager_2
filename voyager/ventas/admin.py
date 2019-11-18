from django.contrib import admin
from reportes.models import Analisis, Cotizacion, Muestra
from .models import Factura

# Register your models here.
admin.site.register(Analisis)
admin.site.register(Muestra)
admin.site.register(Cotizacion)
admin.site.register(Factura)