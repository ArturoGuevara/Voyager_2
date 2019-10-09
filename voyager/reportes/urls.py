from django.urls import path
from . import views

urlpatterns = [
    path('', views.indexView, name='index'),
    path('ordenes_internas', views.ordenes_internas, name='ordenes_internas'),
    path('<int:idOI>/actualizar/', views.oi_actualizar, name='oi_actualizar'),
]