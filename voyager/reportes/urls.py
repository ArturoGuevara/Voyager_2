from django.urls import path
from . import views


urlpatterns = [
    path('ingreso_cliente', views.ingreso_cliente, name='ingreso_cliente'),
    path('registrar_ingreso_muestra', views.registrar_ingreso_muestra, name='registrar_ingreso_muestra'),
    path('', views.indexView, name='index'),
    path('ordenes_internas', views.ordenes_internas, name='ordenes_internas'),
    path('consultar_orden/', views.consultar_orden, name='consultar_orden'),
    path('actualizar_orden/', views.actualizar_orden, name='actualizar_orden'),
    path('actualizar_muestra/', views.actualizar_muestra, name='actualizar_muestra'),
    path('borrar_orden/', views.borrar_orden_interna, name='borrar_orden'),
    path('muestra_enviar',views.muestra_enviar,name='muestra_enviar'),
    path('validacionDhl', views.validacion_codigo, name='validacion_codigo'),
    path('consultar_empresa_muestras/',views.consultar_empresa_muestras, name='consultar_empresa_muestras'),
    path('enviar_archivo/',views.enviar_archivo, name='enviar_archivo'),
    path('visualizar_facturacion/', views.visualizar_facturacion, name='visualizar_facturacion'),
    path('editar_facturacion', views.editar_facturacion, name='editar_facturacion'),
    path('notificar_editar_facturacion', views.notificar_editar_facturacion, name='notificar_editar_facturacion'),
    path('resultados/<str:file>', views.ver_pdf, name="ver_pdf")
]
