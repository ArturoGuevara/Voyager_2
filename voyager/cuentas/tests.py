from django.test import TestCase
from django.contrib.auth.models import User, Group
from cuentas.models import*

#Esta prueba revisa que un usuario pueda entrar al login
class testLogin(TestCase):
    #Aquí se crea la base de datos dentro del ambiente de prueba
    def setUp(self):
        user_dir = User.objects.create_user('dir', 'dirtest@testuser.com', 'testpassword')
        user_ventas = User.objects.create_user('vent', 'venttest@testuser.com', 'testpassword')
        user_facturacion = User.objects.create_user('fact', 'facttest@testuser.com', 'testpassword')
        user_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        user_soporte = User.objects.create_user('soporte', 'soportetest@testuser.com', 'testpassword')
        user_ex_soporte = User.objects.create_user('exsoporte', 'exsoportetest@testuser.com', 'testpassword')


        rol_dir = Rol.objects.create(nombre='Director')
        rol_ventas = Rol.objects.create(nombre='Ventas')
        rol_facturacion = Rol.objects.create(nombre='Facturacion')
        rol_clientes = Rol.objects.create(nombre='Clientes')
        rol_soporte = Rol.objects.create(nombre='Soporte')

        empresa =  Empresa.objects.create(empresa='TestInc')

        director = IFCUsuario.objects.create(
                                                        rol = rol_dir,
                                                        user = user_dir,
                                                        nombre = 'director',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '1234567',
                                                        puesto = 'Director',
                                                        estado = True,
                                                        empresa = empresa,
                                                        contactos='test'
                                                      )
        director.save()

        ventas = IFCUsuario.objects.create(
                                                        rol = rol_ventas,
                                                        user = user_ventas,
                                                        nombre = 'ventas',
                                                        apellido_paterno = 'test',
                                                        apellido_materno = 'test',
                                                        telefono = '3234567',
                                                        puesto = 'Ventas',
                                                        estado = True,
                                                        empresa=empresa,
                                                        contactos='test'
                                                      )
        ventas.save()

        facturacion = IFCUsuario.objects.create(
                                                        rol = rol_facturacion,
                                                        user = user_facturacion,
                                                        nombre ='facturacion',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono ='4234567',
                                                        puesto ='Facturacion',
                                                        estado =True,
                                                        empresa=empresa,
                                                        contactos='test'
                                                      )
        facturacion.save()

        clientes = IFCUsuario.objects.create(
                                                        rol =rol_clientes,
                                                        user = user_clientes,
                                                        nombre = 'clientes',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        puesto = 'Clientes',
                                                        estado = True,
                                                        empresa=empresa,
                                                        contactos='test'
                                                      )
        clientes.save()

        soporte = IFCUsuario.objects.create(
                                                        rol = rol_soporte,
                                                        user = user_soporte,
                                                        nombre ='soporte',
                                                        apellido_paterno='test',
                                                        apellido_materno ='test',
                                                        telefono ='5234567',
                                                        puesto = 'Soporte',
                                                        estado = True,
                                                        empresa=empresa,
                                                        contactos='test'
                                                      )
        soporte.save()

        ex_soporte = IFCUsuario.objects.create(
                                                        rol = rol_soporte,
                                                        user = user_ex_soporte,
                                                        nombre = 'ex_soporte',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        puesto = 'Soporte',
                                                        estado = False,
                                                        empresa=empresa,
                                                        contactos='test'
                                                      )
        soporte.save()


    def test_login_acceso_denegado(self):
        #Esta prueba simula a un usuario que quiere entrar a algún acceso de la página sin acceder con su cuenta
        response = self.client.get('/cuentas/home/')
        self.assertRedirects(response, '/cuentas/login?next=/cuentas/home/', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_login_exitoso_director(self):
        #Esta prueba simula a una usuario con el rol de director que accede correctamente con su usuario y contraseña
        response = self.client.post('/cuentas/verify_login/', {'mail':'dirtest@testuser.com','password':'testpassword'})
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)

    def test_login_exitoso_no_director(self):
        #Esta prueba simula a una usuario con el rol de director que no accede correctamente a su cuenta por tener datos incorrectos
        response = self.client.post('/cuentas/verify_login/', {'mail':'dirtest@testuser.com','password':'testpasswords'})
        self.assertContains(response, "Correo y/o contraseña incorrectos")

    def test_login_exitoso_ventas(self):
        #Esta prueba simula a una usuario con el rol de ventas que accede correctamente con su usuario y contraseña
        response = self.client.post('/cuentas/verify_login/', {'mail':'venttest@testuser.com','password':'testpassword'})
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)

    def test_login_exitoso_facturacion(self):
        #Esta prueba simula a una usuario con el rol de facturacion que accede correctamente con su usuario y contraseña
        response = self.client.post('/cuentas/verify_login/', {'mail':'facttest@testuser.com','password':'testpassword'})
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)

    def test_login_exitoso_clientes(self):
        #Esta prueba simula a una usuario con el rol de director que accede correctamente con su usuario y contraseña
        response = self.client.post('/cuentas/verify_login/', {'mail':'clienttest@testuser.com','password':'testpassword'})
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)

    def test_login_exitoso_soporte(self):
        #Esta prueba simula a una usuario con el rol de soporte que accede correctamente con su usuario y contraseña
        response = self.client.post('/cuentas/verify_login/', {'mail':'soportetest@testuser.com','password':'testpassword'})
        self.assertRedirects(response, '/cuentas/home/', status_code=302, target_status_code=200, msg_prefix='', fetch_redirect_response=True)

    def test_login_estado_innactivo(self):
        #Esta prueba simula a una usuario con el rol de soporte que accede que no puede acceder, ya que su cuenta fue eliminada
        response = self.client.post('/cuentas/verify_login/', {'mail':'exsoportetest@testuser.com','password':'testpassword'})
        self.assertContains(response, "Correo y/o contraseña incorrectos")
