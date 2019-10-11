from django.urls import path
from . import views

urlpatterns = [
    path('ver_catalogo', views.ver_catalogo, name='ver_catalogo'),
    path('cargar_analisis/<int:id>', views.cargar_analisis, name='cargar_analisis'),
    path('editar_analisis/<int:id>', views.editar_analisis, name='editar_analisis'),
]
