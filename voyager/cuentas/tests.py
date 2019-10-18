from django.test import TestCase
from django.contrib.auth.models import User, Group
from cuentas.models import*
from cuentas.models import Rol,IFCUsuario
from django.urls import reverse

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
                                                        estado = True,
                                                        empresa = empresa
                                                      )
        director.save()

        ventas = IFCUsuario.objects.create(
                                                        rol = rol_ventas,
                                                        user = user_ventas,
                                                        nombre = 'ventas',
                                                        apellido_paterno = 'test',
                                                        apellido_materno = 'test',
                                                        telefono = '3234567',
                                                        estado = True,
                                                        empresa=empresa
                                                      )
        ventas.save()

        facturacion = IFCUsuario.objects.create(
                                                        rol = rol_facturacion,
                                                        user = user_facturacion,
                                                        nombre ='facturacion',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono ='4234567',
                                                        estado =True,
                                                        empresa=empresa
                                                      )
        facturacion.save()

        clientes = IFCUsuario.objects.create(
                                                        rol =rol_clientes,
                                                        user = user_clientes,
                                                        nombre = 'clientes',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa=empresa
                                                      )
        clientes.save()

        soporte = IFCUsuario.objects.create(
                                                        rol = rol_soporte,
                                                        user = user_soporte,
                                                        nombre ='soporte',
                                                        apellido_paterno='test',
                                                        apellido_materno ='test',
                                                        telefono ='5234567',
                                                        estado = True,
                                                        empresa=empresa
                                                      )
        soporte.save()

        ex_soporte = IFCUsuario.objects.create(
                                                        rol = rol_soporte,
                                                        user = user_ex_soporte,
                                                        nombre = 'ex_soporte',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = False,
                                                        empresa=empresa
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

class testCrearCliente(TestCase):
    def setup(self):
        role = Rol()
        role.nombre = "Ventas"
        role.save()
        role2 = Rol()
        role2.nombre = "Cliente"
        role2.save()
        user = User.objects.create_user('hockey', 'hockey@lalocura.com', 'lalocura')
        user.save()
        user2 = User.objects.create_user('padrino', 'padrino@lalocura.com', 'padrino')
        user2.save()
        i_user = IFCUsuario()
        i_user.user = user   #Asignar usuario de la tabla User
        i_user.rol = role   #Asignar rol creado
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.estado = True
        i_user.save()   #Guardar usuario de IFC
        i_user2 = IFCUsuario()
        i_user2.user = user2   #Asignar usuario de la tabla User
        i_user2.rol = role2   #Asignar rol creado
        i_user2.nombre = "Padrino"
        i_user2.apellido_paterno = "Lalo"
        i_user2.apellido_materno = "Cura"
        i_user2.telefono = "9114454364"
        i_user2.estado = True
        i_user2.save()   #Guardar usuario de IFC

    def test_no_login_form(self):
        self.setup()
        response = self.client.get(reverse('crear_cliente'))
        self.assertEqual(response.status_code, 302)

    def test_no_login_different_role(self):
        self.setup()
        self.client.login(username='padrino', password='padrino')
        response = self.client.get(reverse('crear_cliente'))
        self.assertEqual(response.status_code, 404)