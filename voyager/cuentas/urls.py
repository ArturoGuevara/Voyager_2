from django.urls import path
from . import views
from django.contrib.auth import views as auth_views


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
    path('clientes/',views.lista_clientes, name='clientes'),
    path('notificar_crear_cliente/', views.notificar_crear_cliente, name='notificar_crear_cliente'),
    path('guardar_perfil/', views.guardar_perfil, name='guardar_perfil'),
    path('notificar_guardar_perfil/', views.notificar_guardar_perfil, name='notificar_guardar_perfil'),
    path('notificar_error_perfil/', views.notificar_error_perfil, name='notificar_error_perfil'),
    path('reset_password/',
            auth_views.PasswordResetView.as_view(template_name = 'cuentas/reset_password_mail.html'),
            name='reset_password'
    ),
    path(
            'reset_password_done/',
            auth_views.PasswordResetDoneView.as_view(template_name = 'cuentas/reset_password_sent.html'),
            name='password_reset_done'
    ),
    path(
            'password_reset_confirm/<uidb64>/<token>/',
            auth_views.PasswordResetConfirmView.as_view(template_name = 'cuentas/reset_password_change.html'),
            name='password_reset_confirm'
    ),
    path(
            'reset_password_complete/',
            auth_views.PasswordResetCompleteView.as_view(template_name = 'cuentas/reset_password_success.html'),
            name='password_reset_complete'
    ),
    path('borrar_usuario/<int:id>', views.borrar_usuario, name='borrar_usuario'),
    path('crear_empresa/', views.crear_empresa, name='crear_empresa'),
    path('empresas/',views.lista_empresas,name='lista_empresas'),
    path('consultar_empresa/',views.consultar_empresa,name='consultar_empresa'),
    path('editar_empresa/',views.editar_empresa,name='editar_empresa'),
    path('eliminar_empresa/',views.eliminar_empresa,name='eliminar_empresa'),
    path('notificar_editar_empresa/', views.notificar_editar_empresa, name='notificar_editar_empresa'),
    path('notificar_borrar_empresa/', views.notificar_borrar_empresa, name='notificar_borrar_empresa'),
]
