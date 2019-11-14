from django.test import TestCase
from ventas.forms import AnalisisForma
from django.urls import reverse, resolve
from .views import agregar_analisis
from reportes.models import Analisis,Cotizacion, Pais, Nota, AnalisisCotizacion
from cuentas.models import Rol,IFCUsuario,Empresa
from django.contrib.auth.models import User
from datetime import datetime, date
from .views import ver_cotizaciones

# Create your tests here.
class TestAnalisis(TestCase):
    def setUp(self):

        pais = Pais(id_pais=1, nombre="Mexico")
        pais.save()

        analisis1 = Analisis(codigo="1", descripcion="Descripcion 1", precio="1500", tiempo="3", unidad_min="500 gr", pais=Pais.objects.get(id_pais=1), acreditacion="0")
        analisis1.save()

        analisis2 = Analisis(codigo="2", descripcion="Descripcion 2", precio="2500", tiempo="5", unidad_min="500 gr", pais=Pais.objects.get(id_pais=1), acreditacion="0")
        analisis2.save()

        analisis3 = Analisis(codigo="3", descripcion="Descripcion 3", precio="3500", tiempo="7", unidad_min="500 gr", pais=Pais.objects.get(id_pais=1), acreditacion="0")
        analisis3.save()

#Unit tests de US06-06 añadir análisis.
    def test_crear_analisis(self):
        self.assertTrue(Analisis.objects.filter(codigo="1"))
        self.assertTrue(Analisis.objects.filter(codigo="2"))
        self.assertTrue(Analisis.objects.filter(codigo="3"))

    def test_url_anadir_analisis(self):
        url = reverse('agregar_analisis')
        self.assertEquals(resolve(url).func,agregar_analisis)

    def test_contar_analisis(self):
        contador = Analisis.objects.all().count()
        self.assertEqual(contador, 3)

    def test_analisis_forma(self):
        form_data = {
        'nombre': 'pesticida',
        'codigo': 'H-091233',
        'descripcion': 'Análisis para detección de pesticida en cultivos',
        'precio': 2000.00,
        'unidad_min': '500 gr',
        'duracion': '5-8 días',
        'pais': '1',
        'acreditacion' : '0'
        }
        form = AnalisisForma(data = form_data)
        self.assertTrue(form.is_valid())


    #def test_anadir_analisis(self):
        #analisis = Analisis.objects.first()
        #self.assertEqual("Analisis 1", analisis.nombre)

    def test_edit_analisis_1(self):
        analisis = Analisis.objects.first()
        auxCodigo = analisis.codigo
        analisis.codigo = 12
        analisis.save()

        self.assertNotEquals(analisis.codigo, auxCodigo)

    # Si truena está bien, porque el analisis no existe
    def test_edit_analisis_2(self):
        var = False
        try:
            analisis = Analisis.objects.get(id=4)
            auxCodigo = analisis.codigo
            analisis.codigo = 12
            analisis.save()
        except:
            var = True
            self.assertEquals(var, True)

    def test_delete_analisis_1(self):
        analisis = Analisis.objects.first()
        analisis.delete()
        contador = Analisis.objects.all().count()

        self.assertEquals(2, contador)

    # Si truena está bien, porque el analisis no existe
    def test_delete_analisis_2(self):
        var = False
        try:
            analisis = Analisis.objects.get(id=3)
            analisis.delete()
            contador = Analisis.objects.all().count()

            self.assertNotEquals(3, contador)
        except:
            var = True
            self.assertEquals(var, True)


class TestCotizaciones(TestCase):
    #Tests de cotizaciones
    def set_up_Users(self):

        #Crea usuarios Clientes
        rol_clientes = Rol.objects.create(nombre='Cliente')
        usuario_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        empresa =  Empresa.objects.create(empresa='TestInc')

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

        #Crea cotizaciones
        cotizacion = Cotizacion.objects.create(
                                                    usuario_c = clientes1,
                                                    usuario_v = ventas,
                                                    subtotal = 5000,
                                                    envio = 150,
                                                    total = 123,
                                                    status = True,
                                                    fecha_creada = date.today()
                                                )
        cotizacion.save()
        cotizacion2 = Cotizacion.objects.create(
                                                    usuario_c = clientes2,
                                                    usuario_v = ventas,
                                                    subtotal = 24,
                                                    envio = 150,
                                                    total = 456,
                                                    status = True,
                                                    fecha_creada = date.today()
                                                )
        cotizacion2.save()
        cotizacion3 = Cotizacion.objects.create(
                                                    usuario_c = clientes1,
                                                    usuario_v = ventas,
                                                    subtotal = 5000,
                                                    envio = 150,
                                                    total = 789,
                                                    status = False,
                                                    fecha_creada = date.today()
                                                )
        cotizacion3.save()

        pais = Pais() # Crear un pais para los analisis
        pais.nombre = "México"
        pais.save()
        a1 = Analisis() #Crear un objeto de Analisis
        a1.codigo = "A1"
        a1.nombre = "Pest"
        a1.descripcion = "agropecuario"
        a1.precio = 213132423.12
        a1.unidad_min = "500 gr"
        a1.tiempo = "1 - 2 días"
        a1.pais = pais
        a1.save()   #Guardar el análisis
        a2 = Analisis()  #Crear un objeto de Analisis
        a2.codigo = "A2"
        a2.nombre = "icida"
        a2.descripcion = "agro"
        a2.precio = 2132423.12
        a2.unidad_min = "1 kg."
        a2.tiempo = "3 - 5 días"
        a2.pais = pais
        a2.save()   #Guardar el análisis

    #Tests
    def test_acceso_denegado(self):
        #Test de acceso a url sin Log In
        response = self.client.get('/ventas/cotizaciones')
        self.assertRedirects(response, '/cuentas/login?next=/ventas/cotizaciones', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_acceso_denegado_rol(self):
        #Test de acceso a url con Log In como Director
        self.set_up_Users() #Set up de datos
        self.client.login(username='direc',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')
        self.assertEqual(response.status_code,404)

    def test_acceso_permitido(self):
        #Test de acceso a url con Log In como Cliente
        self.set_up_Users() #Set up de datos
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')
        self.assertEqual(response.status_code,200)

    def test_template(self):
        #Test de creacion de ordenes internas para usuario
        self.set_up_Users() #Set up de datos
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')

        self.assertContains(response, "123")
        self.assertNotContains(response, "456")

    def test_model(self):
        #Test del model de Cotizaciones
        self.set_up_Users() #Set up de datos

        cotizacion1 = Cotizacion.objects.filter(total=123).first()
        cotizacion2 = Cotizacion.objects.filter(total=456).first()
        cotizacion3 = Cotizacion.objects.filter(total=789).first()

        self.assertEqual(cotizacion1.envio,150.00)
        self.assertEqual(cotizacion2.subtotal,24)
        self.assertEqual(cotizacion3.status,False)

    def test_url_resuelta(self):
        #URL testing.
        url = reverse('cotizaciones')
        self.assertEquals(resolve(url).func,ver_cotizaciones)

    def test_crear_cotizacion_no_post(self):
        #Test del model de Cotizaciones
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        response = self.client.get('/ventas/crear_cotizacion')
        self.assertEqual(response.status_code,301)

    def test_post_empty(self):    #Prueba si no se manda nada en el post
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        response = self.client.post('/ventas/crear_cotizacion',{})
        self.assertEqual(response.status_code,301)

    def test_post_incomplete(self):   #Prueba si el post no lleva todo lo que necesita
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        cliente = IFCUsuario.objects.get(nombre="clientes")
        response = self.client.post('/ventas/crear_cotizacion',{'cliente':cliente.id,
                                                                  'subtotal':500,
                                                                  'envio':10,
                                                                  'total':490,
                                                                  'checked': "",
                                                                  })
        self.assertEqual(response.status_code,301)

    def test_post_complete(self):   #Prueba si el post no lleva todo lo que necesita
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        cliente = IFCUsuario.objects.get(nombre="clientes")
        analisis1 = Analisis.objects.get(codigo="A1")
        analisis2 = Analisis.objects.get(codigo="A2")
        analisis_arr = [analisis1.id_analisis, analisis2.id_analisis]
        cantidades = [3,2]
        response = self.client.post('/ventas/crear_cotizacion',{'cliente':cliente.id,
                                                                  'subtotal':"500",
                                                                  'envio': 15,
                                                                  'total':490,
                                                                  'checked[]': analisis_arr,
                                                                  'cantidades[]': cantidades,
                                                                  })
        self.assertEqual(response.status_code,301)

    def test_visualizar_cotizacion_correcta(self):      # Prueba si se puede visualizar una cotizacion correctamente
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        cliente = IFCUsuario.objects.get(nombre="clientes")
        analisis1 = Analisis.objects.get(codigo="A1")
        analisis2 = Analisis.objects.get(codigo="A2")
        analisis_arr = [analisis1.id_analisis, analisis2.id_analisis]
        cantidades = [3,2]
        response = self.client.post('/ventas/crear_cotizacion',{'cliente':cliente.id,
                                                                  'subtotal':"500",
                                                                  'envio': 15,
                                                                  'total':490,
                                                                  'checked[]': analisis_arr,
                                                                  'cantidades[]': cantidades,
                                                                  })
        url =  '/ventas/visualizar_cotizacion/' + str(Cotizacion.objects.all().last().id_cotizacion)
        response = self.client.post(url)
        self.assertEqual(response.status_code,200)

    def test_visualizar_cotizacion_vacia(self):     # Prueba si te devuelve un error al consultar una cotizacion sin analisis
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        url = url =  '/ventas/visualizar_cotizacion/' + str(Cotizacion.objects.all().last().id_cotizacion)
        response = self.client.post(url)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {'error': 'La cotización no contiene analisis'}
        )

class TestEditarCotizaciones(TestCase):
    #Tests de cotizaciones
    def set_up_Users(self):

        #Crea usuarios Clientes
        rol_clientes = Rol.objects.create(nombre='Cliente')
        usuario_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        empresa =  Empresa.objects.create(empresa='TestInc')

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

        #Crea cotizaciones
        cotizacion = Cotizacion.objects.create(
                                                usuario_c = clientes1,
                                                usuario_v = ventas,
                                                subtotal = 5000,
                                                envio = 150,
                                                total = 123,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion.save()
        cotizacion2 = Cotizacion.objects.create(
                                                usuario_c = clientes2,
                                                usuario_v = ventas,
                                                subtotal = 24,
                                                envio = 150,
                                                total = 456,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion2.save()
        cotizacion3 = Cotizacion.objects.create(
                                                usuario_c = clientes1,
                                                usuario_v = ventas,
                                                subtotal = 5000,
                                                envio = 150,
                                                total = 789,
                                                status = False,
                                                fecha_creada = date.today()
                                                )
        cotizacion3.save()

        pais = Pais() # Crear un pais para los analisis
        pais.nombre = "México"
        pais.save()
        a1 = Analisis() #Crear un objeto de Analisis
        a1.codigo = "A1"
        a1.nombre = "Pest"
        a1.descripcion = "agropecuario"
        a1.precio = 213132423.12
        a1.unidad_min = "500 gr"
        a1.tiempo = "1 - 2 días"
        a1.pais = pais
        a1.save()   #Guardar el análisis
        a2 = Analisis()  #Crear un objeto de Analisis
        a2.codigo = "A2"
        a2.nombre = "icida"
        a2.descripcion = "agro"
        a2.precio = 2132423.12
        a2.unidad_min = "1 kg."
        a2.tiempo = "3 - 5 días"
        a2.pais = pais
        a2.save()   #Guardar el análisis

    #Tests
    def test_acceso_denegado(self):
        #Test de acceso a url sin Log In
        response = self.client.get('/ventas/cotizaciones')
        self.assertRedirects(response, '/cuentas/login?next=/ventas/cotizaciones', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_acceso_denegado_rol(self):
        #Test de acceso a url con Log In como Director
        self.set_up_Users() #Set up de datos
        self.client.login(username='direc',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')
        self.assertEqual(response.status_code,404)

    def test_acceso_permitido(self):
        #Test de acceso a url con Log In como Cliente
        self.set_up_Users() #Set up de datos
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')
        self.assertEqual(response.status_code,200)

    def test_template(self):
        #Test de creacion de ordenes internas para usuario
        self.set_up_Users() #Set up de datos
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')

        self.assertContains(response, "123")
        self.assertNotContains(response, "456")

    def test_model(self):
        #Test del model de Cotizaciones
        self.set_up_Users() #Set up de datos

        cotizacion1 = Cotizacion.objects.filter(total=123).first()
        cotizacion2 = Cotizacion.objects.filter(total=456).first()
        cotizacion3 = Cotizacion.objects.filter(total=789).first()

        self.assertEqual(cotizacion1.envio,150.00)
        self.assertEqual(cotizacion2.subtotal,24)
        self.assertEqual(cotizacion3.status,False)

    def test_url_resuelta(self):
        #URL testing.
        url = reverse('cotizaciones')
        self.assertEquals(resolve(url).func,ver_cotizaciones)

    def test_crear_cotizacion_no_post(self):
        #Test del model de Cotizaciones
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        response = self.client.get('/ventas/crear_cotizacion')
        self.assertEqual(response.status_code,301)

    def test_post_empty(self):    #Prueba si no se manda nada en el post
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        response = self.client.post('/ventas/crear_cotizacion',{})
        self.assertEqual(response.status_code,301)

    def test_post_incomplete(self):   #Prueba si el post no lleva todo lo que necesita
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        cliente = IFCUsuario.objects.get(nombre="clientes")
        response = self.client.post('/ventas/crear_cotizacion',{'cliente':cliente.id,
                                                                  'subtotal':500,
                                                                  'envio':"",
                                                                  'total':490,
                                                                  'checked': "",
                                                                  })
        self.assertEqual(response.status_code,301)

    def test_post_complete(self):   #Prueba si el post no lleva todo lo que necesita
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        cliente = IFCUsuario.objects.get(nombre="clientes")
        analisis1 = Analisis.objects.get(codigo="A1")
        analisis2 = Analisis.objects.get(codigo="A2")
        analisis_arr = [analisis1.id_analisis, analisis2.id_analisis]
        cantidades = [3,2]
        response = self.client.post('/ventas/crear_cotizacion',{'cliente':cliente.id,
                                                                'subtotal':"500",
                                                                'envio': 15,
                                                                'total':490,
                                                                'checked[]': analisis_arr,
                                                                'cantidades[]': cantidades,
                                                                })
        self.assertEqual(response.status_code,301)

    def test_visualizar_cotizacion_correcta(self):      # Prueba si se puede visualizar una cotizacion correctamente
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        cliente = IFCUsuario.objects.get(nombre="clientes")
        analisis1 = Analisis.objects.get(codigo="A1")
        analisis2 = Analisis.objects.get(codigo="A2")
        analisis_arr = [analisis1.id_analisis, analisis2.id_analisis]
        cantidades = [3,2]
        response = self.client.post('/ventas/crear_cotizacion',{'cliente':cliente.id,
                                                                'subtotal':"500",
                                                                'envio': 15,
                                                                'total':490,
                                                                'checked[]': analisis_arr,
                                                                'cantidades[]': cantidades,
                                                                })
        url =  '/ventas/visualizar_cotizacion/' + str(Cotizacion.objects.all().last().id_cotizacion)
        response = self.client.post(url)
        self.assertEqual(response.status_code,200)

    def test_visualizar_cotizacion_vacia(self):     # Prueba si te devuelve un error al consultar una cotizacion sin analisis
        self.set_up_Users() #Set up de datos
        self.client.login(username='vent',password='testpassword')
        url = url =  '/ventas/visualizar_cotizacion/' + str(Cotizacion.objects.all().last().id_cotizacion)
        response = self.client.post(url)
        self.assertJSONEqual(
            str(response.content, encoding='utf8'),
            {'error': 'La cotización no contiene analisis'}
        )


class TestEliminarCotizaciones(TestCase):
    #Tests de cotizaciones
    def set_up_everything(self):

        #Crea usuarios Clientes
        rol_clientes = Rol.objects.create(nombre='Cliente')
        usuario_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        empresa =  Empresa.objects.create(empresa='TestInc')

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

        #Crea cotizaciones
        cotizacion = Cotizacion.objects.create(
                                                usuario_c = clientes1,
                                                usuario_v = ventas,
                                                subtotal = 5000,
                                                envio = 150,
                                                total = 123,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion.save()
        cotizacion2 = Cotizacion.objects.create(
                                                usuario_c = clientes2,
                                                usuario_v = ventas,
                                                subtotal = 24,
                                                envio = 150,
                                                total = 456,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion2.save()
        cotizacion3 = Cotizacion.objects.create(
                                                usuario_c = clientes1,
                                                usuario_v = ventas,
                                                subtotal = 5000,
                                                envio = 150,
                                                total = 789,
                                                status = False,
                                                fecha_creada = date.today()
                                                )
        cotizacion3.save()

        pais = Pais() # Crear un pais para los analisis
        pais.nombre = "México"
        pais.save()
        a1 = Analisis() #Crear un objeto de Analisis
        a1.codigo = "A1"
        a1.nombre = "Pest"
        a1.descripcion = "agropecuario"
        a1.precio = 213132423.12
        a1.unidad_min = "500 gr"
        a1.tiempo = "1 - 2 días"
        a1.pais = pais
        a1.save()   #Guardar el análisis
        a2 = Analisis()  #Crear un objeto de Analisis
        a2.codigo = "A2"
        a2.nombre = "icida"
        a2.descripcion = "agro"
        a2.precio = 2132423.12
        a2.unidad_min = "1 kg."
        a2.tiempo = "3 - 5 días"
        a2.pais = pais
        a2.save()   #Guardar el análisis

        def test_delete_cotizacion_1(self):
            cotizacion = Cotizacion.objects.first()
            cotizacion.status = False
            contador = Cotizacion.objects.filter(status=True).count()
            self.assertEquals(2, contador)

        # Si truena está bien, porque el analisis no existe
        def test_delete_cotizacion_2(self):
            var = False
            try:
                cotizacion = Cotizacion.objects.get(id=3)
                cotizacion.status = False
                contador = Cotizacion.objects.filter(status=True).count()
                self.assertNotEquals(3, contador)
            except:
                var = True
                self.assertEquals(var, True)

class TestAceptarCotizaciones(TestCase):
    def set_up_all_cot(self):

        #Crea usuarios Clientes
        rol_clientes = Rol.objects.create(nombre='Cliente')
        usuario_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        empresa =  Empresa.objects.create(empresa='TestInc')

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

        #Crea cotizaciones
        cotizacion = Cotizacion.objects.create(
                                                usuario_c = clientes1,
                                                usuario_v = ventas,
                                                subtotal = 5000,
                                                envio = 150,
                                                total = 123,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion.save()
        cotizacion2 = Cotizacion.objects.create(
                                                usuario_c = clientes2,
                                                usuario_v = ventas,
                                                subtotal = 24,
                                                envio = 150,
                                                total = 456,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion2.save()
        cotizacion3 = Cotizacion.objects.create(
                                                usuario_c = clientes1,
                                                usuario_v = ventas,
                                                subtotal = 5000,
                                                envio = 150,
                                                total = 789,
                                                status = True,
                                                fecha_creada = date.today()
                                                )
        cotizacion3.save()

        pais = Pais() # Crear un pais para los analisis
        pais.nombre = "México"
        pais.save()
        a1 = Analisis() #Crear un objeto de Analisis
        a1.codigo = "A1"
        a1.nombre = "Pest"
        a1.descripcion = "agropecuario"
        a1.precio = 213132423.12
        a1.unidad_min = "500 gr"
        a1.tiempo = "1 - 2 días"
        a1.pais = pais
        a1.save()   #Guardar el análisis
        a2 = Analisis()  #Crear un objeto de Analisis
        a2.codigo = "A2"
        a2.nombre = "icida"
        a2.descripcion = "agro"
        a2.precio = 2132423.12
        a2.unidad_min = "1 kg."
        a2.tiempo = "3 - 5 días"
        a2.pais = pais
        a2.save()   #Guardar el análisis

        def test_accept_cotizacion_1(self):
            cotizacion = Cotizacion.objects.first()
            contador = Cotizacion.objects.filter(status=False).count()
            self.assertEquals(3, contador)
            response = self.client.get('/ventas/cotizaciones')
            self.assertNotContains(response, "Aceptado")

        # Si truena está bien, porque el analisis no existe
        def test_accept_cotizacion_2(self):
            cotizacion = Cotizacion.objects.first()
            cotizacion.aceptado = True;
            contador = Cotizacion.objects.filter(status=True).count()
            self.assertEquals(1, contador)
            response = self.client.get('/ventas/cotizaciones')
            self.assertContains(response, "Aceptado")
