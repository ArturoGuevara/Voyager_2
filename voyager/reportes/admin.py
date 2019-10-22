from django.contrib import admin
from .models import Paquete, OrdenInterna, Pais

admin.site.register(OrdenInterna)
admin.site.register(Paquete)
admin.site.register(Pais)
