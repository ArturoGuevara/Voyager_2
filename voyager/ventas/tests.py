from django.test import TestCase
from ventas.forms import AnalisisForma
from django.urls import reverse, resolve
from .views import agregar_analisis
from reportes.models import Analisis,Cotizacion, Pais, Nota
from cuentas.models import Rol,IFCUsuario,Empresa
from django.contrib.auth.models import User
from datetime import datetime, date

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

    def set_up_Users(self):
        rol_clientes = Rol.objects.create(nombre='Cliente')
        user_clientes = User.objects.create_user('client', 'clienttest@testuser.com', 'testpassword')
        empresa =  Empresa.objects.create(empresa='TestInc')
        clientes1 = IFCUsuario.objects.create(
                                                        rol =rol_clientes,
                                                        user = user_clientes,
                                                        nombre = 'clientes',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa=empresa,
                                                      )
        clientes1.save()

        user_clientes = User.objects.create_user('otro', 'otro@testuser.com', 'testpassword')
        clientes2 = IFCUsuario.objects.create(
                                                        rol =rol_clientes,
                                                        user = user_clientes,
                                                        nombre = 'otro',
                                                        apellido_paterno = 'test',
                                                        apellido_materno ='test',
                                                        telefono = '5234567',
                                                        estado = True,
                                                        empresa=empresa,
                                                      )
        clientes2.save()


        user_ventas = User.objects.create_user('vent', 'venttest@testuser.com', 'testpassword')
        rol_ventas = Rol.objects.create(nombre='Ventas')

        ventas = IFCUsuario.objects.create(
                                                        rol = rol_ventas,
                                                        user = user_ventas,
                                                        nombre = 'ventas',
                                                        apellido_paterno = 'test',
                                                        apellido_materno = 'test',
                                                        telefono = '3234567',
                                                        estado = True,
                                                        empresa=empresa,
                                                      )
        ventas.save()


        cotizacion = Cotizacion.objects.create(
                                                    usuario_c = clientes1,
                                                    usuario_v = ventas,
                                                    descuento = 5,
                                                    subtotal = 5000,
                                                    iva = 150,
                                                    total = 123,
                                                    status = True,
                                                    fecha_creada = date.today()
                                                )
        cotizacion.save()
        cotizacion2 = Cotizacion.objects.create(
                                                    usuario_c = clientes2,
                                                    usuario_v = ventas,
                                                    descuento = 10,
                                                    subtotal = 5000,
                                                    iva = 150,
                                                    total = 456,
                                                    status = True,
                                                    fecha_creada = date.today()
                                                )
        cotizacion2.save()
        cotizacion3 = Cotizacion.objects.create(
                                                    usuario_c = clientes1,
                                                    usuario_v = ventas,
                                                    descuento = 5,
                                                    subtotal = 5000,
                                                    iva = 150,
                                                    total = 789,
                                                    status = True,
                                                    fecha_creada = date.today()
                                                )
        cotizacion3.save()

    def test_controlador_acceso_denegado(self):
        #Test de acceso a url sin Log In
        response = self.client.get('/ventas/cotizaciones')
        self.assertRedirects(response, '/cuentas/login?next=/ventas/cotizaciones', status_code=302, target_status_code=301, msg_prefix='', fetch_redirect_response=True)

    def test_controlador_acceso_denegado_rol(self):
        #Test de acceso a url con Log In como Ventas
        self.set_up_Users()
        self.client.login(username='vent',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')
        self.assertEqual(response.status_code,404)
        #self.assertRedirects(response, '/ventas/cotizaciones', status_code=302, target_status_code=404, msg_prefix='', fetch_redirect_response=True)

    def test_controlador_acceso_permitido(self):
        #Test de acceso a url con Log In como Cliente
        self.set_up_Users()
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')
        self.assertEqual(response.status_code,200)

    def test_template(self):
        #Test de creacion de ordenes internas para usuario
        self.set_up_Users()
        self.client.login(username='client',password='testpassword')
        response = self.client.get('/ventas/cotizaciones')

        self.assertContains(response, "123")
        self.assertNotContains(response, "456")
        self.assertContains(response, "789")
