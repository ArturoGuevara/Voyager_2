from django.urls import path
from . import views

urlpatterns = [
    path('', views.indexView, name='index'),
    path('ordenes_internas', views.ordenes_internas, name='ordenes_internas'),
    path('busqueda/<int:id>', views.busqueda, name='busqueda'),
    path('busqueda2/<int:id>', views.busqueda2, name='busqueda2'),
   	#path(r'^(?P<pk>\d+)/update/$', views.oi_actualizar, name='book_update'),
]
