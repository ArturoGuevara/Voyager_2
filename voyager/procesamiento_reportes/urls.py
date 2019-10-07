from django.urls import path

from . import views

urlpatterns = [
    path('ingreso_cliente', views.ingreso_cliente, name='ingreso_cliente'),
]
