from django.test import TestCase
from reportes.models import Analisis,Cotizacion
from cuentas.models import Rol,IFCUsuario,Empresa
from django.contrib.auth.models import User
from datetime import datetime, date

# Create your tests here.
class TestAnalisis(TestCase):
    def setUp(self):
        analisis1 = Analisis(codigo="1", nombre="Analisis 1", descripcion="Descripcion 1", precio="1500", tiempo="3")
        analisis1.save()
        
        analisis2 = Analisis(codigo="2", nombre="Analisis 2", descripcion="Descripcion 2", precio="2500", tiempo="5")
        analisis2.save()
        
        analisis3 = Analisis(codigo="3", nombre="Analisis 3", descripcion="Descripcion 3", precio="3500", tiempo="7")
        analisis3.save()
        
    def test_contar_analisis(self):
        contador = Analisis.objects.all().count()
        self.assertEqual(contador, 3)
    
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


        user_ventas = User.objects.create_user('vent', 'venttest@testuser.com', 'testpassword')
        rol_ventas = Rol.objects.create(nombre='Ventas')

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


        cotizacion = Cotizacion.objects.create(
                                                    usuario_c = clientes,
                                                    usuario_v = ventas,
                                                    descuento = 5,
                                                    subtotal = 5000,
                                                    iva = 150,
                                                    total = 50000,
                                                    status = True,
                                                    fecha_creada = date.today()
                                                )
        cotizacion.save()
        
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
    #def test_controlador_ver_cotizaciones(self):

