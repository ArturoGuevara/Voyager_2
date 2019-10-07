from django.urls import path

from . import views

urlpatterns = [
    path('', views.indexView, name='index'),
    path('ingresar_muestras',views.ingresar_muestra,name='Ingresar muestra')
]
