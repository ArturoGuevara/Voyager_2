from django.contrib import admin
from .models import IFCUsuario, Rol, Empresa, Permiso, PermisoRol
# Register your models here.
admin.site.register(IFCUsuario)
admin.site.register(Rol)
admin.site.register(Empresa)
admin.site.register(Permiso)
admin.site.register(PermisoRol)