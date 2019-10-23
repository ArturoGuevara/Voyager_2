from django.urls import path
from . import views

urlpatterns = [
    path('ver_catalogo', views.ver_catalogo, name='ver_catalogo'),
    path('cargar_analisis/<int:id>', views.cargar_analisis, name='cargar_analisis'),
    path('editar_analisis/<int:id>', views.editar_analisis, name='editar_analisis'),
    path('borrar_analisis/<int:id>', views.borrar_analisis, name='borrar_analisis'),
    path('cargar_cot/', views.cargar_cot, name='cargar_cot'),
    path('crear_cotizacion/', views.crear_cotizacion, name='crear_cotizacion'),
    path('cotizaciones', views.ver_cotizaciones, name='cotizaciones'),
]