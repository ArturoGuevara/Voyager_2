from django.contrib import admin
from .models import Paquete, OrdenInterna, Pais, AnalisisCotizacion, AnalisisMuestra, FacturaOI, TerminosCondiciones

admin.site.register(OrdenInterna)
admin.site.register(Paquete)
admin.site.register(Pais)
admin.site.register(AnalisisCotizacion)
admin.site.register(AnalisisMuestra)
admin.site.register(FacturaOI)
admin.site.register(TerminosCondiciones)