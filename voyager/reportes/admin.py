from django.contrib import admin
from .models import OrdenInterna, Muestra, Paquete

admin.site.register(OrdenInterna)
admin.site.register(Paquete)
admin.site.register(Muestra)
