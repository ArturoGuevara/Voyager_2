from django.test import TestCase
from django.contrib.auth.models import User, Group
from cuentas.models import*

#Esta prueba revisa que un usuario pueda entrar al login
class testLogin(TestCase):
    def test_login_usuario_correcto(self):
        user = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')
        response = self.client.get('/cuentas/login/', {'email':'dirtest@testuser.com','password':'testpassword'})
        print(response)
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)
"""
    def test_login_usuario_incorrecto(self):
        user = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')
        response = self.client.get('/cuentas/login/', {'mail':'dirtest@testuser.com','password':'testpassword'})
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)
"""
