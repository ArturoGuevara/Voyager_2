from django.test import TestCase


#Esta prueba revisa que un usuario pueda entrar al login
class LoginTest(TestCase):
    def login_usuario_correcto_director(self):
        user = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')
        rol = Rol.objects.create('Director')
        ifc_user = IFCUsuario.objects.create_user(user=user,rol=rol,'director','test','test','1234567','Director')
        self.client.login(email="dirtest@testuser.com", password="testpassword")
        response = self.client.get('/cuentas/home/')
        self.assertEqual(response.status_code, 302)
