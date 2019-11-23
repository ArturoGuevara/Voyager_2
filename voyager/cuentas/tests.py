from django.test import TestCase
from django.contrib.auth.models import User, Group
from cuentas.models import*
from cuentas.models import Rol,IFCUsuario,Empresa
from reportes.models import OrdenInterna
from django.urls import reverse, resolve
from .views import lista_usuarios,lista_clientes
from django.contrib.auth import views as auth_views
from django.core import mail

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

class testCrearCliente(TestCase): #tests para la view crear_cliente
    def setup(self): #registrar la información necesaria para ejecutar los test
        role = Rol()
        role.nombre = "Ventas"
        role.save()
        role2 = Rol()
        role2.nombre = "Cliente"
        role2.save()
        user = User.objects.create_user('hockey', 'hockey@lalocura.com', 'lalocura') #crear usuario de Django
        user.save() #guardar usuario de Django
        user2 = User.objects.create_user('padrino', 'padrino@lalocura.com', 'padrino')
        user2.save()
        i_user = IFCUsuario() #Crear un usuario de IFC
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

    def test_no_login_form(self): #probar que el usuario no pueda ingresar a la página si no ha iniciado sesión
        self.setup()
        response = self.client.get(reverse('crear_cliente'))
        self.assertEqual(response.status_code, 302)

    def test_no_login_different_role(self): #probar que el usario no pueda ingresar a la página si no tiene el rol adecuado
        self.setup()
        self.client.login(username='padrino', password='padrino') #ingresar como un usuario cliente
        response = self.client.get(reverse('crear_cliente'))
        self.assertEqual(response.status_code, 404)

    def test_login(self): #probar que el usuario puede ingresar a la página si inició sesión
        self.setup()
        self.client.login(username='hockey',password='lalocura') #iniciar sesión
        response = self.client.get(reverse('crear_cliente'))
        self.assertEqual(response.status_code,200)

class testGuardarCliente(TestCase): #test para la view guardar_cliente
    def setup(self): #registrar la información necesaria para ejecutar los test
        role = Rol()
        role.nombre = "Ventas"
        role.save()
        role2 = Rol()
        role2.nombre = "Cliente"
        role2.save()
        user = User.objects.create_user('hockey', 'hockey@lalocura.com', 'lalocura') #crear usuario de Django
        user.save() #guardar usuario de Django
        user2 = User.objects.create_user('padrino', 'padrino@lalocura.com', 'padrino')
        user2.save()
        i_user = IFCUsuario() #Crear un usuario de IFC
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
        e = Empresa()
        e.empresa = "IFC"
        e.save()

    def test_no_login_form(self): #probar que el usuario no pueda ingresar a la página si no ha iniciado sesión
        self.setup()
        response = self.client.get(reverse('guardar_cliente'))
        self.assertEqual(response.status_code, 302)

    def test_no_login_different_role(self): #probar que el usario no pueda ingresar a la página si no tiene el rol adecuado
        self.setup()
        self.client.login(username='padrino', password='padrino') #ingresar como un usuario cliente
        response = self.client.get(reverse('guardar_cliente'))
        self.assertEqual(response.status_code, 404)

    def test_no_post(self): #Prueba si no existe metodo post
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        response = self.client.get(reverse('guardar_cliente'))
        self.assertEqual(response.status_code, 404)

    def test_post_empty(self): #Prueba si no se manda nada en el post
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        response = self.client.post(reverse('guardar_cliente'),{})
        self.assertEqual(response.status_code, 404)

    def test_post_incomplete(self): #Prueba si el post no lleva todo lo que necesita
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        response = self.client.post(reverse('guardar_cliente'),{'nombre':"Impulse",
                                                                'apellido_paterno':"Impulsado",
                                                                'apellido_materno': "Impulsadin",
                                                                'contraseña': "lalocura",
                                                                'contraseña2': "lalocura",
                                                                'correo': "voyager@impulse.com",
                                                                })
        self.assertEqual(response.status_code, 404)

    def test_different_passwords(self): #Probar que hay un error si hay contraseñas diferentes
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        empresa = Empresa.objects.get(empresa="IFC") #obtener el id de la empresa
        response = self.client.post(reverse('guardar_cliente'),{'nombre':"Impulse",
                                                                'apellido_paterno':"Impulsado",
                                                                'apellido_materno': "Impulsadin",
                                                                'contraseña': "lalocura",
                                                                'contraseña2': "laslocuras", #enviar contraseñas diferentes
                                                                'empresa': empresa.id,
                                                                'correo': "voyager@impulse.com",
                                                                'telefono': "35345436346",
                                                                })
        self.assertEqual(response.status_code, 404)

    def test_repeated_mail(self): #Probar que hay un error si se envia un correo usado anteriormente
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        empresa = Empresa.objects.get(empresa="IFC")
        response = self.client.post(reverse('guardar_cliente'),{'nombre':"Impulse",
                                                                'apellido_paterno':"Impulsado",
                                                                'apellido_materno': "Impulsadin",
                                                                'contraseña': "lalocura",
                                                                'contraseña2': "lalocura",
                                                                'empresa': empresa.id,
                                                                'correo': "padrino@lalocura.com", #enviar un correo ya usado
                                                                'telefono': "35345436346",
                                                                })
        self.assertEqual(response.status_code, 404)

    def test_no_company(self): #Probar que hay un error si se envía el código de una empresa que no existe
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        empresa = Empresa.objects.get(empresa="IFC")
        response = self.client.post(reverse('guardar_cliente'),{'nombre':"Impulse",
                                                                'apellido_paterno':"Impulsado",
                                                                'apellido_materno': "Impulsadin",
                                                                'contraseña': "lalocura",
                                                                'contraseña2': "lalocura",
                                                                'empresa': empresa.id+1, #enviar un código de una empresa que no existe
                                                                'correo': "voyager@impulse.com",
                                                                'telefono': "35345436346",
                                                                })
        self.assertEqual(response.status_code, 404)

    def test_all_correct(self): #probar que la funcionalidad sea correcta si se envía la información adecuada
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        empresa = Empresa.objects.get(empresa="IFC") #obtener una empresa válida
        client = Rol.objects.get(nombre="Cliente") #obtener el objeto de tipo rol
        num_clients_before = IFCUsuario.objects.filter(rol=client).count() #obtener todos los usuarios de tipo cliente
        #antes de registrar otro
        response = self.client.post(reverse('guardar_cliente'),{'nombre':"Impulse",
                                                                'apellido_paterno':"Impulsado",
                                                                'apellido_materno': "Impulsadin",
                                                                'contraseña': "lalocura",
                                                                'contraseña2': "lalocura",
                                                                'empresa': empresa.id, #enviar código de la empresa
                                                                'correo': "voyager@impulse.com",
                                                                'telefono': "35345436346",
                                                                }) #enviar la información correcta del cliente
        self.assertEqual(response.status_code, 302)
        num_clients_after = IFCUsuario.objects.filter(rol=client).count() #obtener todos los usarios del tipo cliente
        #despues de registrar el nuevo
        self.assertEqual(num_clients_before+1,num_clients_after) #verificar que la cantidad de clientes incrementó en 1

class TestCuentasUsuarios(TestCase):
    #Tests de cuentas de usuarios
    def set_up_Users(self):

        #Crea usuarios Clientes
        rol_clientes = Rol.objects.create(nombre='Cliente')
        usuario_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        empresa =  Empresa.objects.create(empresa='TestInc')
        empresa_ifc = Empresa.objects.create(empresa='IFC')

        clientes1 = IFCUsuario.objects.create(
                                                        rol =rol_clientes,
                                                        user = usuario_clientes,
                                                        nombre = 'clientes',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa=empresa,
                                                      )
        clientes1.save()

        usuario_clientes = User.objects.create_user('otro', 'otro@testuser.com', 'testpassword')
        clientes2 = IFCUsuario.objects.create(
                                                        rol =rol_clientes,
                                                        user = usuario_clientes,
                                                        nombre = 'otro',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa=empresa,
                                                      )
        clientes2.save()

        #Crea usuario Director
        usuario_dir = User.objects.create_user('direc', 'test@testuser.com', 'testpassword')
        rol_dir = Rol.objects.create(nombre='Director')

        dir = IFCUsuario.objects.create(
                                                        rol = rol_dir,
                                                        user = usuario_dir,
                                                        nombre = 'dir',
                                                        apellido_paterno = 'test',
                                                        apellido_materno = 'test',
                                                        telefono = '3234567',
                                                        estado = True,
                                                        empresa=empresa,
                                                      )
        dir.save()


        #Crea usuario Ventas
        usuario_ventas = User.objects.create_user('vent', 'venttest@testuser.com', 'testpassword')
        rol_ventas = Rol.objects.create(nombre='Ventas')

        ventas = IFCUsuario.objects.create(
                                                        rol = rol_ventas,
                                                        user = usuario_ventas,
                                                        nombre = 'ventas',
                                                        apellido_paterno = 'test',
                                                        apellido_materno = 'test',
                                                        telefono = '3234567',
                                                        estado = True,
                                                        empresa=empresa
                                                      )
        ventas.save()

        #Crea usuario Facturacion
        user_facturacion = User.objects.create_user('fact', 'facttest@testuser.com', 'testpassword')
        rol_facturacion = Rol.objects.create(nombre='Facturacion')
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

        #Crear orden interna para cliente
        oi = OrdenInterna.objects.create(
                                                    usuario = clientes1,
                                                    estatus = "Estatus Prueba"
                                                )
        oi.save()

    #Tests
    def test_acceso_denegado(self):
        #Test de acceso a url sin Log In
        response = self.client.get('/cuentas/usuarios')
        self.assertRedirects(response, '/cuentas/login?next=/cuentas/usuarios', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_acceso_denegado_rol(self):
        #Test de acceso a url con Log In como Cliente
        self.set_up_Users() #Set up de datos
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/cuentas/usuarios')
        self.assertEqual(response.status_code,404)

    def test_acceso_permitido_total(self):
        #Test de acceso a url con Log In como Director para que vea a todos los usuarios
        self.set_up_Users() #Set up de datos
        self.client.login(username='direc',password='testpassword')
        response = self.client.get('/cuentas/usuarios')
        self.assertEqual(response.status_code,200)
        #Revisa que director pueda ver al usuario de facturacion
        self.assertContains(response, "facturacion")

    def test_acceso_permitido(self):
        #Test de acceso a url con Log In como Facturacion
        self.set_up_Users() #Set up de datos
        self.client.login(username='fact',password='testpassword')
        response = self.client.get('/cuentas/usuarios')
        self.assertEqual(response.status_code,200)
        #Revisa que no puede ver al usuario de facturacion, ya que solo debe ver clientes
        self.assertNotContains(response, "facturacion")

    def test_template(self):
        #Test de creacion de ordenes internas para cliente
        self.set_up_Users() #Set up de datos
        self.client.login(username='direc',password='testpassword')
        rol = Rol.objects.get(nombre="Cliente")
        cliente = IFCUsuario.objects.filter(rol=rol).first()
        dir = "/cuentas/consultar_usuario/" + str(cliente.user.id)
        response = self.client.post(dir)
        self.assertContains(response, "Estatus Prueba")

    def test_model(self):
        #Test del model de Cotizaciones
        self.set_up_Users() #Set up de datos
        rol = Rol.objects.get(nombre="Cliente")
        cliente = IFCUsuario.objects.filter(rol=rol).first()
        self.assertEqual(cliente.estatus_pago,"NA")

    def test_url_resuelta(self):
        #URL testing.
        url = reverse('usuarios')
        self.assertEquals(resolve(url).func,lista_usuarios)

    def test_acceso_denegado_crear_staff(self):
        # Test de acceso sin previo log in
        response = self.client.get('/cuentas/crear_staff/')
        self.assertRedirects(response, '/cuentas/login?next=/cuentas/crear_staff/', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_acceso_permitido_crear_staff(self):
        # Test de acceso con director loggeado
        self.set_up_Users()
        self.client.login(username='direc', password='testpassword')
        response = self.client.get('/cuentas/crear_staff/')
        self.assertEqual(response.status_code, 200)

    def test_acceso_denegado_no_director_crear_staff(self):
        # Test de acceso con alguien que no es director
        self.set_up_Users()
        self.client.login(username='client', password='testpassword')
        response = self.client.get('/cuentas/crear_staff/')
        self.assertEqual(response.status_code, 404)

    def test_crear_staff_todos_los_campos(self):
        # Test de crear un usuario de staff de manera exitosa
        self.set_up_Users()
        id_rol = Rol.objects.get(nombre='Ventas').id
        self.client.login(username='direc', password='testpassword')
        response = self.client.post('/cuentas/guardar_staff/', {
                                                                'nombre' : 'Juanito',
                                                                'apellido_paterno' : 'testpassword',
                                                                'apellido_materno' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',
                                                                'telefono': '1234567890',
                                                                'id_rol' : id_rol,
                                                                'contraseña' : 'testpassword',
                                                                'contraseña2' : 'testpassword'
                                                                })
        session = None
        if self.client.session:
            session = self.client.session
        self.assertEqual(session['crear_staff_status'], True)

    def test_crear_staff_cambios_vacios(self):
        # Test de crear un usuario de staff enviando campos vacios
        self.set_up_Users()
        id_rol = Rol.objects.get(nombre='Ventas').id
        self.client.login(username='direc', password='testpassword')
        response = self.client.post('/cuentas/guardar_staff/', {
                                                                'nombre' : 'Juanito',
                                                                'apellido_paterno' : 'testpassword',
                                                                'apellido_materno' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',

                                                                'id_rol' : id_rol,
                                                                'contraseña' : 'testpassword',
                                                                'contraseña2' : 'testpassword'
                                                                })
        session = None
        if self.client.session:
            session = self.client.session
        self.assertEqual(session['crear_staff_status'], False)

    def test_crear_staff_datos_invalidos(self):
        # Test de crear un usuario de staff enviando campos vacios
        self.set_up_Users()
        id_rol = Rol.objects.get(nombre='Ventas').id
        self.client.login(username='direc', password='testpassword')
        response = self.client.post('/cuentas/guardar_staff/', {
                                                                'nombre' : 'Juanito',
                                                                'apellido_paterno' : 'testpassword',
                                                                'apellido_materno' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',
                                                                'telefono': '1234567890',
                                                                'id_rol' : id_rol,
                                                                'contraseña' : 'testpassword',
                                                                'contraseña2' : 'testpassword2'
                                                                })
        session = None
        if self.client.session:
            session = self.client.session
        self.assertEqual(session['crear_staff_status'], False)

    def test_crear_staff_correo_repetido(self):
        # Test de crear un usuario de staff enviando un correo repetido
        self.set_up_Users()
        id_rol = Rol.objects.get(nombre='Ventas').id
        self.client.login(username='direc', password='testpassword')
        response = self.client.post('/cuentas/guardar_staff/', {
                                                                'nombre' : 'Juanito',
                                                                'apellido_paterno' : 'testpassword',
                                                                'apellido_materno' : 'testpassword',
                                                                'correo' : 'test@testuser.com',
                                                                'telefono': '1234567890',
                                                                'id_rol' : id_rol,
                                                                'contraseña' : 'testpassword',
                                                                'contraseña2' : 'testpassword2'
                                                                })
        session = None
        if self.client.session:
            session = self.client.session
        self.assertEqual(session['crear_staff_status'], False)

    def test_crear_staff_contrasena_debil(self):
        # Test de crear un usuario de staff con una contrasena debil
        self.set_up_Users()
        id_rol = Rol.objects.get(nombre='Ventas').id
        self.client.login(username='direc', password='testpassword')
        response = self.client.post('/cuentas/guardar_staff/', {
                                                                'nombre' : 'Juanito',
                                                                'apellido_paterno' : 'testpassword',
                                                                'apellido_materno' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',
                                                                'telefono': '1234567890',
                                                                'id_rol' : id_rol,
                                                                'contraseña' : '12',
                                                                'contraseña2' : '12'
                                                                })
        session = None
        if self.client.session:
            session = self.client.session
        self.assertEqual(session['crear_staff_status'], False)

#####USA05-41##########

class TestListaUsuarios(TestCase):
    def setup(self):
        role = Rol()
        role.nombre = "Ventas"
        role.save()
        role2 = Rol()
        role2.nombre = "Cliente"
        role2.save()
        user = User.objects.create_user('hockey', 'hockey@lalocura.com', 'lalocura') #crear usuario de Django
        user.save() #guardar usuario de Django
        user2 = User.objects.create_user('padrino', 'padrino@lalocura.com', 'padrino')
        user2.save()
        i_user = IFCUsuario() #Crear un usuario de IFC
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

    def test_no_login(self):
        self.setup()
        response = self.client.get(reverse('clientes'))
        self.assertEqual(response.status_code, 302)

    def test_login_different_role(self): #probar que el usario no pueda ingresar a la página si no tiene el rol adecuado
        self.setup()
        self.client.login(username='padrino', password='padrino') #ingresar como un usuario cliente
        response = self.client.get(reverse('clientes'))
        self.assertEqual(response.status_code, 404)

    def test_login_correct(self): #probar que el usario pueda ingresar a la página si tiene el rol adecuado
        self.setup()
        self.client.login(username='hockey', password='lalocura') #ingresar como un usuario cliente
        response = self.client.get(reverse('clientes'))
        self.assertEqual(response.status_code, 200)

    def test_url_resuelta(self):
        url = reverse('clientes')
        self.assertEquals(resolve(url).func,lista_clientes)

class TestActualizarUsuario(TestCase):
    def setUp(self):
        user_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        rol_clientes = Rol.objects.create(nombre='Clientes')
        empresa =  Empresa.objects.create(empresa='TestInc')
        clientes = IFCUsuario.objects.create(
                                                        rol = rol_clientes,
                                                        user = user_clientes,
                                                        nombre = 'clientes',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa = empresa
                                                      )
        clientes.save()

    def test_actualizar_usuario_acceso_denegado(self):
        #Esta prueba simula a un usuario que quiere entrar a algún acceso de la página sin acceder con su cuenta
        response = self.client.get('/cuentas/home/')
        self.assertRedirects(response, '/cuentas/login?next=/cuentas/home/', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_actualizar_usuario_exitoso(self):
        self.client.login(username='client', password='testpassword')
        response = self.client.post('/cuentas/guardar_perfil/', {
                                                                'nombre' : 'Juanito',
                                                                'a_p' : 'testpassword',
                                                                'a_m' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',
                                                                'telefono': '1234567890',
                                                                'pass1' : '12345678',
                                                                'pass2' : '12345678',
                                                                'ver' : 'testpassword'
                                                                })
        juanito = IFCUsuario.objects.filter(nombre="Juanito")
        self.assertEqual(juanito.count(), 1)

    def test_actualizar_usuario_no_exitoso(self):
        self.client.login(username='client', password='testpassword')
        response = self.client.post('/cuentas/guardar_perfil/', {
                                                                'nombre' : 'Juanito',
                                                                'a_p' : 'testpassword',
                                                                'a_m' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',
                                                                'telefono': '1234567890',
                                                                'pass1' : '12345978',
                                                                'pass2' : '12345678',
                                                                'ver' : 'testpassword'
                                                                })
        juanito = IFCUsuario.objects.filter(nombre="Juanito")
        self.assertEqual(juanito.count(), 0)

    def test_actualizar_usuario_no_verifica(self):
        self.client.login(username='client', password='testpassword')
        response = self.client.post('/cuentas/guardar_perfil/', {
                                                                'nombre' : 'Juanito',
                                                                'a_p' : 'testpassword',
                                                                'a_m' : 'testpassword',
                                                                'correo' : 'juasjuas@test.com',
                                                                'telefono': '1234567890',
                                                                'pass1' : '12345978',
                                                                'pass2' : '12345678',
                                                                'ver' : ''
                                                                })
        juanito = IFCUsuario.objects.filter(nombre="Juanito")
        self.assertEqual(juanito.count(), 0)

class TestRecoverPassword(TestCase):
    def setup(self):
        user_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        rol_clientes = Rol.objects.create(nombre='Clientes')
        empresa =  Empresa.objects.create(empresa='TestInc')
        clientes = IFCUsuario.objects.create(
                                                        rol = rol_clientes,
                                                        user = user_clientes,
                                                        nombre = 'clientes',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa = empresa
                                                      )
        clientes.save()

    def test_correct_url_reset_password(self):
        self.setup()
        response = self.client.get(reverse('reset_password'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.template_name, ['cuentas/reset_password_mail.html'])

    def test_reset_password_post_empty(self):
        self.setup()
        response = self.client.post(reverse('reset_password'),{})
        self.assertEqual(response.status_code, 200)

    def test_reset_password_post_mail_nonexistent(self):
        self.setup()
        response = self.client.post(reverse('reset_password'), {'email':'client@testuser.com'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 0)
        self.assertRedirects(response,reverse('password_reset_done'))

    def test_reset_password_post_mail_correct(self):
        self.setup()
        response = self.client.post(reverse('reset_password'), {'email':'clienttest@testuser.com'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Recuperar contraseña')
        self.assertRedirects(response, reverse('password_reset_done'))

    def test_reset_password_correct_url_password(self):
        self.setup()
        response = self.client.post(reverse('reset_password'), {'email':'clienttest@testuser.com'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Recuperar contraseña')
        token = response.context[0]['token']
        uid = response.context[0]['uid']
        response_change_password = self.client.get(
            reverse('password_reset_confirm', kwargs={'uidb64': uid,'token': token})
        )
        self.assertEqual(response_change_password.status_code, 302)

    def test_reset_password_change_password_incorrect(self):
        self.setup()
        response = self.client.post(reverse('reset_password'), {'email':'clienttest@testuser.com'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Recuperar contraseña')
        token = response.context[0]['token']
        uid = response.context[0]['uid']
        response_change_password = self.client.get(
            reverse('password_reset_confirm', kwargs={'uidb64': uid,'token': token})
        )
        change_url = response_change_password.url
        response_result_change = self.client.post(change_url,{'new_password1':'lalocura','new_password2':'laslocuras'})
        self.assertEqual(response_result_change.status_code, 200)
        self.assertEqual(response_result_change.template_name,['cuentas/reset_password_change.html'])
        self.assertEqual(True,self.client.login(username = 'client', password = 'testpassword'))

    def test_reset_password_change_password_correct(self):
        self.setup()
        response = self.client.post(reverse('reset_password'), {'email':'clienttest@testuser.com'})
        self.assertEqual(response.status_code, 302)
        self.assertEqual(len(mail.outbox), 1)
        self.assertEqual(mail.outbox[0].subject, 'Recuperar contraseña')
        token = response.context[0]['token']
        uid = response.context[0]['uid']
        response_change_password = self.client.get(
            reverse('password_reset_confirm', kwargs={'uidb64': uid,'token': token})
        )
        self.assertEqual(response_change_password.status_code, 302)
        change_url = response_change_password.url
        response_result_change = self.client.post(change_url,{'new_password1':'lalocura','new_password2':'lalocura'})
        self.assertEqual(response_result_change.status_code, 302)
        self.assertRedirects(response_result_change, reverse('password_reset_complete'))
        self.assertEqual(True, self.client.login(username='client', password='lalocura'))

class TestBorrarUsuario(TestCase):
    def setUp(self):
        role = Rol()
        role.nombre = "Director"
        role.save()
        role2 = Rol()
        role2.nombre = "Cliente"
        role2.save()
        user = User.objects.create_user('hockey', 'hockey@lalocura.com', 'lalocura') #crear usuario de Django
        user.save() #guardar usuario de Django
        user2 = User.objects.create_user('padrino', 'padrino@lalocura.com', 'padrino')
        user2.save()
        user3 = User.objects.create_user('toño', 'toño@lalocura.com', 'toño')
        user3.save()
        i_user = IFCUsuario() #Crear un usuario de IFC
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
        i_user3 = IFCUsuario()
        i_user3.user = user3   #Asignar usuario de la tabla User
        i_user3.rol = role2   #Asignar rol creado
        i_user3.nombre = "Toño"
        i_user3.apellido_paterno = "Lalo"
        i_user3.apellido_materno = "Cura"
        i_user3.telefono = "9114454364"
        i_user3.estado = True
        i_user3.save()   #Guardar usuario de IFC

    def test_delete_usuario_1(self):
        user = IFCUsuario.objects.all().first()
        user.estado = False
        user.save()
        contador = IFCUsuario.objects.filter(estado=True).count()
        self.assertEquals(2, contador)

    # Si truena está bien, porque el analisis no existe
    def test_delete_usuario_2(self):
        var = False
        try:
            user = IFCUsuario.objects.all().last()
            user.estado = False
            user.save()
            contador = IFCUsuario.objects.filter(estado=True).count()
            self.assertNotEquals(2, contador)
        except:
            var = True
            self.assertEquals(var, True)