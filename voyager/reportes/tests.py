from django.test import TestCase,TransactionTestCase
from django.contrib.auth.models import User
from cuentas.models import IFCUsuario,Rol
from .models import AnalisisCotizacion,Cotizacion,AnalisisMuestra,Muestra,Analisis,OrdenInterna
from django.urls import reverse
from django.http import HttpResponse
from django.test.client import Client
import datetime

# Create your tests here.
class IngresoClienteTests(TestCase):
    def create_role_client(self):
        role = Rol()
        role.nombre = "Cliente"
        role.save()
        return role

    def create_user_django(self):
        user = User.objects.create_user('hockey','hockey@lalocura.com','lalocura')
        user.save()
        return user

    def create_IFCUsuario(self):
        i_user = IFCUsuario()
        i_user.user = self.create_user_django()
        i_user.rol = self.create_role_client()
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.puesto = "puesto"
        i_user.estado = True
        i_user.save()

    def test_no_login(self):
        self.create_role_client()
        response = self.client.get(reverse('ingreso_cliente'))
        self.assertEqual(response.status_code,302)

    def test_login(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.get(reverse('ingreso_cliente'))
        self.assertEqual(response.status_code,200)

class IngresoMuestrasTests(TestCase):
    def create_role_client(self):
        role = Rol()
        role.nombre = "Cliente"
        role.save()
        return role

    def create_user_django(self):
        user = User.objects.create_user('hockey','hockey@lalocura.com','lalocura')
        user.save()
        return user

    def create_IFCUsuario(self):
        i_user = IFCUsuario()
        i_user.user = self.create_user_django()
        i_user.rol = self.create_role_client()
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.puesto = "puesto"
        i_user.estado = True
        i_user.save()


    def test_no_login(self):
        self.create_role_client()
        response = self.client.get(reverse('ingresar_muestras'))
        self.assertEqual(response.status_code,302)

    def test_login_no_post(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.get(reverse('ingresar_muestras'))
        self.assertEqual(response.status_code,404)

    def test_login_post_empty(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'),{})
        self.assertEqual(response.status_code,404)

    def test_login_post_incomplete(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'),{'nombre':"Impulse",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado1':"Zacatecas"
                                                                  })
        self.assertEqual(response.status_code,404)

    def test_login_post_empty_field(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'), {'nombre': '',
                                                                   'direccion': "impulsadin",
                                                                   'pais': "Antigua y Barbuda",
                                                                   'idioma': "8992 EN",
                                                                   'estado1': "Saint John's"
                                                                   })
        self.assertEqual(response.status_code,404)

    def test_login_post_complete(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'), {'nombre': "Impulse",
                                                                   'direccion': "impulsadin",
                                                                   'pais': "Antigua y Barbuda",
                                                                   'idioma': "8992 EN",
                                                                   'estado1': "Saint John's"
                                                                   })
        self.assertEqual(response.status_code,200)

class MuestraEnviarTests(TestCase):
    def create_role_client(self):
        role = Rol()
        role.nombre = "Cliente"
        role.save()
        return role

    def create_user_django(self):
        user = User.objects.create_user('hockey','hockey@lalocura.com','lalocura')
        user.save()
        return user

    def create_IFCUsuario(self):
        i_user = IFCUsuario()
        i_user.user = self.create_user_django()
        i_user.rol = self.create_role_client()
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.puesto = "puesto"
        i_user.estado = True
        i_user.save()

    def create_phantom(self):
        user = User.objects.create_user('danny_phantom', 'danny@phantom.com', 'phantom')
        user.save()
        user_phantom = IFCUsuario()
        user_phantom.user = user
        user_phantom.rol = self.create_role_client()
        user_phantom.nombre = "Danny"
        user_phantom.apellido_paterno = "Phantom"
        user_phantom.apellido_materno = "Phantom"
        user_phantom.telefono = "9114364"
        user_phantom.puesto = "puesto"
        user_phantom.estado = True
        user_phantom.save()


    def setup(self):
        u1 = IFCUsuario.objects.all().first()
        self.create_phantom()
        u2 = IFCUsuario.objects.all().last()
        c = Cotizacion()
        c.usuario_c = u1
        c.usuario_v = u2
        c.descuento = 10.00
        c.subtotal = 10000.00
        c.iva = 100.00
        c.total = 1234235.00
        c.status = True
        c.save()
        a1 = Analisis()
        a1.codigo = "A1"
        a1.nombre = "Pest"
        a1.descripcion = "agropecuario"
        a1.precio = 213132423.12
        a1.tiempo = 1
        a1.save()
        a2 = Analisis()
        a2.codigo = "A2"
        a2.nombre = "icida"
        a2.descripcion = "agro"
        a2.precio = 2132423.12
        a2.tiempo = 2
        a2.save()
        ac1 = AnalisisCotizacion()
        ac1.analisis = a1
        ac1.cotizacion = c
        ac1.cantidad = 10000
        ac1.fecha = datetime.datetime.now().date()
        ac1.save()
        ac2 = AnalisisCotizacion()
        ac2.analisis = a2
        ac2.cotizacion = c
        ac2.cantidad = 100
        ac2.fecha = datetime.datetime.now().date()
        ac2.save()
        otro = Analisis()
        otro.codigo = "Otro"
        otro.nombre = "Otro"
        otro.descripcion = "Otro"
        otro.precio = 0.00
        otro.tiempo = 0
        otro.save()

    def test_no_login(self):
        self.create_role_client()
        response = self.client.get(reverse('muestra_enviar'))
        self.assertEqual(response.status_code,302)

    def test_no_post(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.get(reverse('muestra_enviar'))
        self.assertEqual(response.status_code,404)

    def test_post_empty(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('muestra_enviar'),{})
        self.assertEqual(response.status_code,404)

    def test_post_incomplete(self):
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'parcela':"parcelin",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "1",
                                                                  })
        self.assertEqual(response.status_code,404)

    def test_select_single_analysis_correct(self): #probar que se ha enviado la información correcta para registrar una muestra para un solo análisis
        self.create_IFCUsuario()
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        number_analysis = AnalisisCotizacion.objects.all().first().cantidad #obtener la cantidad de análisis disponibles
        analysis_id = Analisis.objects.all().first().id_analisis #obtener el id del análisis
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado':"Saint John's",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"fritas",
                                                                  'parcela':"parcelin",
                                                                  'pais_destino':"Albania",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "1",
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  'analisis'+str(analysis_id):"on",
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),1) #verificar que hay un registro en la tabla análisis muestra
        self.assertEqual(all_analysis_samples.first().estado,True) #verificar que la muestra está activa
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'fantasma') #verificar que el estado de la orden interna sea el correcto
        all_analysis_cot = AnalisisCotizacion.objects.all()
        self.assertEqual(all_analysis_cot.first().cantidad,number_analysis-1) #verificar que se disminuyó la cantidad de análisis disponibles
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),1) #verificar que hay un registro en la tabla muestras
        self.assertEqual(all_samples.first().estado_muestra,True) #verificar que la muestra está activa

    def test_select_other_correct(self): #probar que la funcionalidad sea correcta si se registra la opción de "otros" para análisis
        self.create_IFCUsuario()
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado':"Saint John's",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"fritas",
                                                                  'parcela':"parcelin",
                                                                  'pais_destino':"Albania",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "1",
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  'otro':"on"
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),1) #verificar que hay un registro en la tabla análisis muestra
        self.assertEqual(all_analysis_samples.first().estado,True) #verificar que la muestra está activa
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'fantasma') #verificar que el estado de la orden interna sea el correcto
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),1) #verificar que hay un registro en la tabla muestras
        self.assertEqual(all_samples.first().estado_muestra,True) #verificar que la muestra está activa

    def test_select_all_analysis_correct(self): #probar que la funcionalidad sea correcta si se registran todos los análisis y se envían
        self.create_IFCUsuario()
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        number_analysis = AnalisisCotizacion.objects.all().first().cantidad #obtener la cantidad de análisis disponibles para el primer análisis
        number_analysis2 = AnalisisCotizacion.objects.all().last().cantidad #obtener la cantidad de análisis disponibles para el segundo análisis
        analysis_id = Analisis.objects.all().get(codigo="A1").id_analisis #obtener el id del primer análisis
        analysis_id2 = Analisis.objects.all().get(codigo="A2").id_analisis #obtener el id del segundo análisis
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado':"Saint John's",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"fritas",
                                                                  'parcela':"parcelin",
                                                                  'pais_destino':"Albania",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "1",
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  'analisis'+str(analysis_id):"on",
                                                                  'analisis'+str(analysis_id2):"on",
                                                                  'otro':"on",
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),3) #verificar que hay 3 entradas en la tabla análisis muestra
        for ansamp in all_analysis_samples: #iterar sobre todos los registros de análisis muestra
            self.assertEqual(ansamp.estado,True) #verificar que los registros aparezcan como activos
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'fantasma') #verificar que el estado de la orden interna sea el correcto
        all_analysis_cot = AnalisisCotizacion.objects.all()
        self.assertEqual(all_analysis_cot.first().cantidad,number_analysis-1) #verificar que se disminuyó la cantidad de análisis disponibles para el primer análisis
        self.assertEqual(all_analysis_cot.last().cantidad, number_analysis2 - 1) #verificar que se disminuyó la cantidad de análisis disponibles para el segundo análisis
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),1) #verificar que hay un registro en la tabla muestras
        self.assertEqual(all_samples.first().estado_muestra,True) #verificar que la muestra está activa

    def test_select_all_analysis_correct_save(self): #probar que la funcionalidad sea correcta si se registran todos los análisis y se guardan sin enviar
        self.create_IFCUsuario()
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        number_analysis = AnalisisCotizacion.objects.all().first().cantidad #obtener la cantidad de análisis disponibles para el primer análisis
        number_analysis2 = AnalisisCotizacion.objects.all().last().cantidad #obtener la cantidad de análisis disponibles para el segundo análisis
        analysis_id = Analisis.objects.all().get(codigo="A1").id_analisis #obtener el id del primer análisis
        analysis_id2 = Analisis.objects.all().get(codigo="A2").id_analisis #obtener el id del segundo análisis
        self.assertEqual(True,True)
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado':"Saint John's",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"fritas",
                                                                  'parcela':"parcelin",
                                                                  'pais_destino':"Albania",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "0", #configurar para guardar y no enviar
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  'analisis'+str(analysis_id):"on",
                                                                  'analisis'+str(analysis_id2):"on",
                                                                  'otro':"on",
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),3) #verificar que hay 3 entradas en la tabla análisis muestra
        for ansamp in all_analysis_samples: #iterar sobre todos los registros de análisis muestra
            self.assertEqual(ansamp.estado,False) #verificar que los registros aparezcan como inactivos
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'invisible') #verificar que el estado de la orden interna sea el correcto
        all_analysis_cot = AnalisisCotizacion.objects.all()
        self.assertEqual(all_analysis_cot.first().cantidad,number_analysis) #verificar que no se disminuyó la cantidad de análisis disponibles para el primer análisis
        self.assertEqual(all_analysis_cot.last().cantidad, number_analysis2) #verificar que no se disminuyó la cantidad de análisis disponibles para el segundo análisis
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),1) #verificar que hay un registro en la tabla muestras
        self.assertEqual(all_samples.first().estado_muestra,False) #verificar que la muestra está inactiva

    def test_no_analysis_correct(self): #probar que la funcionalidad sea correcta si no se eligen análisis para la muestra
        self.create_IFCUsuario()
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        number_analysis = AnalisisCotizacion.objects.all().first().cantidad #obtener la cantidad de análisis disponibles
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado':"Saint John's",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"fritas",
                                                                  'parcela':"parcelin",
                                                                  'pais_destino':"Albania",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "1",
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),0) #verificar que hay 0 entradas en la tabla análisis muestra
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'fantasma') #verificar que el estado de la orden interna sea el correcto
        all_analysis_cot = AnalisisCotizacion.objects.all()
        self.assertEqual(all_analysis_cot.first().cantidad,number_analysis) #verificar que no se disminuyó la cantidad de análisis disponibles para el análisis
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),1) #verificar que hay un registro en la tabla muestras
        self.assertEqual(all_samples.first().estado_muestra,True) #verificar que la muestra está activa

    def test_analysis_two_same_day(self): #probar que la funcionalidad sea correcta si se registran 2 análisis el mismo día
        self.create_IFCUsuario()
        self.setup()
        self.client.login(username='hockey', password='lalocura')
        number_analysis = AnalisisCotizacion.objects.all().first().cantidad #obtener la cantidad de análisis disponibles para el primer análisis
        number_analysis2 = AnalisisCotizacion.objects.all().last().cantidad #obtener la cantidad de análisis disponibles para el segundo análisis
        analysis_id = Analisis.objects.all().get(codigo="A1").id_analisis #obtener el id del primer análisis
        analysis_id2 = Analisis.objects.all().get(codigo="A2").id_analisis #obtener el id del segundo análisis
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar para la primera muestra
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado':"Saint John's",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"fritas",
                                                                  'parcela':"parcelin",
                                                                  'pais_destino':"Albania",
                                                                  'clave_muestra':"CLAVE",
                                                                  'enviar': "1",
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  'analisis'+str(analysis_id):"on",
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),1) #verificar que hay un registro en la tabla análisis muestra
        self.assertEqual(all_analysis_samples.first().estado,True) #verificar que la muestra está activa
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'fantasma') #verificar que el estado de la orden interna sea el correcto
        all_analysis_cot = AnalisisCotizacion.objects.all()
        self.assertEqual(all_analysis_cot.first().cantidad,number_analysis-1) #verificar que se disminuyó la cantidad de análisis disponibles
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),1) #verificar que hay un registro en la tabla muestras
        self.assertEqual(all_samples.first().estado_muestra,True) #verificar que la muestra está activa
        response = self.client.post(reverse('muestra_enviar'),{'nombre':"Impulse", #enviar la información para guardar para la segunda muestra
                                                                  'direccion':"Impulsadin",
                                                                  'pais':"Italia",
                                                                  'estado':"Roma",
                                                                  'idioma':"8992 EN",
                                                                  'producto':"papas",
                                                                  'variedad':"adobadas",
                                                                  'parcela':"parcela",
                                                                  'pais_destino':"Alemania",
                                                                  'clave_muestra':"CLAVE2",
                                                                  'enviar': "1",
                                                                  'fecha_muestreo':datetime.datetime.now().date(),
                                                                  'analisis'+str(analysis_id2):"on",
                                                                  })
        self.assertEqual(response.status_code, 302) #verificar que el usuario ha sido redireccionado
        all_analysis_samples = AnalisisMuestra.objects.all()
        self.assertEqual(all_analysis_samples.count(),2) #verificar que hay dos registros en la tabla análisis muestra
        self.assertEqual(all_analysis_samples.last().estado,True) #verificar que la muestra está activa
        all_internal_orders = OrdenInterna.objects.all()
        self.assertEqual(all_internal_orders.count(),1) #verificar que hay un solo registro en la tabla orden interna
        self.assertEqual(all_internal_orders.first().estatus,'fantasma') #verificar que el estado de la orden interna sea el correcto
        all_analysis_cot = AnalisisCotizacion.objects.all()
        self.assertEqual(all_analysis_cot.last().cantidad,number_analysis2-1) #verificar que se disminuyó la cantidad de análisis disponibles
        all_samples = Muestra.objects.all()
        self.assertEqual(all_samples.count(),2) #verificar que hay dos registros en la tabla muestras
        self.assertEqual(all_samples.last().estado_muestra,True) #verificar que la muestra está activa