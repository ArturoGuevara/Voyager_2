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
