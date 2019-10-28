from django.urls import path
from . import views


urlpatterns = [
    path('ingresar_muestras',views.ingresar_muestras,name='ingresar_muestras'),
    path('ingreso_cliente', views.ingreso_cliente, name='ingreso_cliente'),
    path('', views.indexView, name='index'),
    path('ordenes_internas', views.ordenes_internas, name='ordenes_internas'),
    path('consultar_orden/<int:id>', views.consultar_orden, name='consultar_orden'),
    path('actualizar_orden/', views.actualizar_orden, name='actualizar_orden'),
    path('borrar_orden/<int:id>', views.borrar_orden_interna, name='borrar_orden'),
    path('muestra_enviar',views.muestra_enviar,name='muestra_enviar'),
    path('validacionDhl', views.validacion_codigo, name='validacion_codigo'),
]
