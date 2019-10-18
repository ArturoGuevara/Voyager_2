from django.contrib import admin
from reportes.models import Analisis, Cotizacion, Muestra

# Register your models here.
admin.site.register(Analisis)
admin.site.register(Muestra)
admin.site.register(Cotizacion)