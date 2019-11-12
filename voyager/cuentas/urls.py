from django.urls import path
from . import views


urlpatterns = [
    path('login/',views.loginView,name='login'),
    path('verify_login/', views.verifyLogin, name='backend_login'),
    path('home/', views.homeView, name='home'),
    path('logout/', views.logoutControler, name='logout'),
    path('logged_out/', views.loggedOut, name='logged_out'),
    path('usuarios', views.lista_usuarios, name='usuarios'),
    path('consultar_usuario/<int:id>', views.consultar_usuario, name='consultar_usuario'),
    path('actualizar_usuario/', views.actualizar_usuario, name='actualizar_usuario'),
    path('crear_cliente/', views.crear_cliente, name='crear_cliente'),
    path('crear_staff/', views.crear_staff, name='crear_staff'),
    path('guardar_cliente/', views.guardar_cliente, name='guardar_cliente'),
    path('guardar_staff/', views.guardar_staff, name='guardar_staff'),
    path('notificar_crear_staff/', views.notificar_crear_staff, name='notificar_crear_staff'),
    path('verificar_correo/',views.verificar_correo, name='verificar_correo'),
    path('', views.indexView, name=''),
]
