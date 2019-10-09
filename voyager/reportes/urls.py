from django.urls import path
from . import views

urlpatterns = [
    path('ingresar_muestras',views.ingresar_muestras,name='ingresar_muestras'),
    path('ingreso_cliente', views.ingreso_cliente, name='ingreso_cliente'),
    path('', views.indexView, name='index'),
    path('ordenes_internas', views.ordenes_internas, name='ordenes_internas'),
    path('<int:idOI>/actualizar/', views.oi_actualizar, name='oi_actualizar'),
]