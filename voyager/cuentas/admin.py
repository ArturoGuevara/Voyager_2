from django.contrib import admin
from .models import IFCUsuario, Rol, Empresa
# Register your models here.
admin.site.register(IFCUsuario)
admin.site.register(Rol)
admin.site.register(Empresa)