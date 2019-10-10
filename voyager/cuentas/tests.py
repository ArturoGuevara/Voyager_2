from django.test import TestCase
from django.contrib.auth.models import User, Group
from cuentas.models import*

#Esta prueba revisa que un usuario pueda entrar al login
class testLogin(TestCase):
    def test_login_usuario_correcto(self):
        user = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')
        rol = Rol.objects.create(nombre='Director')
        ifc_user = IFCUsuario.objects.create(
                                                    rol=rol,
                                                    user=user,
                                                    nombre='director',
                                                    apellido_paterno='test',
                                                    apellido_materno ='test',
                                                    telefono='1234567',
                                                    puesto='Director'
                                                  )
        ifc_user.save()
        response = self.client.get('/cuentas/login/')
        self.client.login(email="dirtest@testuser.com", password="testpassword")
        response = self.client.get('/cuentas/home/')
        print("\n"+response['location'])
        self.assertEqual(response.status_code, 302)

    def test_login_usuario_incorrecto(self):
        user = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')
        rol = Rol.objects.create(nombre='Director')
        ifc_user = IFCUsuario.objects.create(
                                                    rol=rol,
                                                    user=user,
                                                    nombre='director',
                                                    apellido_paterno='test',
                                                    apellido_materno ='test',
                                                    telefono='1234567',
                                                    puesto='Director'
                                                  )
        ifc_user.save()
        self.client.login(email="lololo@testuser.com", password="testpassword")
        response = self.client.get('/cuentas/home/')
        print("\n"+response['location'])
        self.assertEqual(response.status_code, 302)


class TestLogout(TestCase):

    def setUp(self):
        # Con esta funcion se crea un usuario para que se pueda probar el cierre de sesion
        user_dir = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')  # Se crea el objeto User
        rol_dir = Rol.objects.create(nombre='Director')                                     # Se crea el objeto del rol para el usuario

        director = IFCUsuario.objects.create(                                               # Se crea el objeto del usuario de IFC
                                                        rol = rol_dir,
                                                        user = user_dir,
                                                        nombre = 'director',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '1234567',
                                                        puesto = 'Director',
                                                        estado = True
                                                      )
        director.save()                                                                     # Se guarda el usuario en la base de datos volatil

    def test_logout_exitoso(self):
        # El usuario se redirecciona al login nuevamente despues de cerrar sesion
        self.client.post('/cuentas/verify_login/', {'mail':'dirtest@testuser.com','password':'testpassword'})   # Se inicia sesion
        response = self.client.post('/cuentas/logout/')                                                         # Se cierra la sesion                                                                # Se intenta acceder a home sin iniciar sesion
        self.assertRedirects(response, '/cuentas/logged_out/')
