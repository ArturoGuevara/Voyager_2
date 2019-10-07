from django.urls import path

from . import views

urlpatterns = [
    path('ingresar_muestras',views.ingresar_muestra,name='Ingresar muestra'),
    path('ingreso_cliente', views.ingreso_cliente, name='ingreso_cliente'),
]
