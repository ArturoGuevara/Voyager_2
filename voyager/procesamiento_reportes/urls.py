from django.urls import path
from django.conf.urls import urls
from . import views

urlpatterns = [
    path('', views.indexView, name='index'),
    path('ordenes_internas', views.ordenes_internas, name='ordenes_internas'),
   	path(r'^(?P<pk>\d+)/update/$', views.oi_actualizar, name='book_update'),


]
