from django.urls import reverse, resolve
from .forms import codigoDHL
from .views import validacion_dhl, validacion_codigo
from .models import Paquete
from django.test import TestCase,TransactionTestCase
from django.contrib.auth.models import User
from cuentas.models import IFCUsuario,Rol
from .models import AnalisisCotizacion,Cotizacion,AnalisisMuestra,Muestra,Analisis,OrdenInterna
from django.http import HttpResponse
from django.test.client import Client
import datetime

# Create your tests here.
class DHLTests(TestCase):
    def test_modelo_paquete(self):
        #Model testing Paquetes
        Paquete.objects.create(
            id_paquete = 1,
            codigo_dhl = "1234567891"
        )
        self.assertTrue(Paquete.objects.filter(id_paquete=1))

#Form testing  
    def test_form_dhl_valido(self):
        form_data = {'codigo_dhl': '1234567891'}
        form = codigoDHL(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_dhl_invalido(self):
        form_data = {'codigo_dhl': '123456789111'}
        form = codigoDHL(data=form_data)
        self.assertFalse(form.is_valid())

# View testing
    def test_view_dhl_error_numerico(self):
        codigo = "8426939232"
        view = validacion_dhl(codigo)
        self.assertTrue(view != 200)

    def test_view_dhl_caracteres(self):
        codigo = "shhsdheas"
        view = validacion_dhl(codigo)
        self.assertTrue(view != 200)

    def test_form_dhl_error_alfanumerico(self):
        codigo = "shh3d1e2s"
        view = validacion_dhl(codigo)
        self.assertTrue(view != 200)

    def test_form_dhl_correcto(self):
        codigo = "8426939231"
        view = validacion_dhl(codigo)
        self.assertTrue(view == 200)

    def test_url_resolved_validacion_codigo(self):
        #URL testing.
        url = reverse('validacion_codigo')
        self.assertEquals(resolve(url).func,validacion_codigo)

    def test_paquete_rastreo(self):
        #Crear un paquete y revisar su código de rastreo. 
        paquete = Paquete.objects.create(
        id_paquete = 2,
        codigo_dhl = "8426939231"
        )
        codigo = paquete.codigo_dhl
        view = validacion_dhl(str(codigo))
        self.assertTrue(view == 200)


# Create your tests here.
class IngresoClienteTests(TestCase):   #Casos de prueba para la vista de ingreso_cliente
    def create_role_client(self):   #Crear rol en base de datos de tests
        role = Rol()
        role.nombre = "Cliente"
        role.save()
        return role

    def create_user_django(self):   #Crear usuario en tabla usuario de Django
        user = User.objects.create_user('hockey','hockey@lalocura.com','lalocura')
        user.save()
        return user

    def create_IFCUsuario(self):   #Crear usuario de IFC
        i_user = IFCUsuario()
        i_user.user = self.create_user_django()   #Asignar usuario de la tabla User
        i_user.rol = self.create_role_client()   #Asignar rol creado
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.estado = True
        i_user.save()   #Guardar usuario de IFC

    def test_no_login(self):   #Prueba si el usuario no ha iniciado sesión
        self.create_role_client()   #Llamar función para crear rol
        response = self.client.get(reverse('ingreso_cliente'))   #Ir a página de ingreso de cliente
        self.assertEqual(response.status_code,302)   #La página debe de redireccionar porque no existe sesión

    def test_login(self):   #Pruena si el usuario ya inició sesión
        self.create_IFCUsuario()   #Llamar la función para crear usuario de IFC
        self.client.login(username='hockey',password='lalocura')   #Hacer inicio de sesión
        response = self.client.get(reverse('ingreso_cliente'))
        self.assertEqual(response.status_code,200)   #Todo debe de salir correctamente

class IngresoMuestrasTests(TestCase):   #Casos de prueba para la vista de ingresar_muestras
    def create_role_client(self):   #Crear rol en base de datos de tests
        role = Rol()
        role.nombre = "Cliente"
        role.save()
        return role

    def create_user_django(self):   #Crear usuario en tabla usuario de Django
        user = User.objects.create_user('hockey','hockey@lalocura.com','lalocura')
        user.save()
        return user

    def create_IFCUsuario(self):   #Crear usuario de IFC
        i_user = IFCUsuario()
        i_user.user = self.create_user_django()   #Asignar usuario de la tabla User
        i_user.rol = self.create_role_client()   #Asignar rol creado
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.estado = True
        i_user.save() #Guardar usuario de IFC

    def test_no_login(self):   #Prueba si el usuario no ha iniciado sesión
        self.create_role_client()
        response = self.client.get(reverse('ingresar_muestras'))
        self.assertEqual(response.status_code,302)

    def test_no_post(self):   #Prueba si no existe metodo post
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.get(reverse('ingresar_muestras'))   #Cambia de página sin método post
        self.assertEqual(response.status_code,404)   #Mostrar 404

    def test_post_empty(self):   #Prueba si no se manda nada en el post
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'),{})   #El post va vacío
        self.assertEqual(response.status_code,404)   #Mostrar 404

    def test_post_incomplete(self):   #Prueba si el post no lleva todo lo que necesita
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'),{'nombre':"Impulse",   #Las variables de post no están completas
                                                                  'pais':"Antigua y Barbuda",
                                                                  'estado1':"Zacatecas"
                                                                  })
        self.assertEqual(response.status_code,404)   #Mostrar 404

    def test_post_empty_field(self):   #Prueba si algún post manda algo vacío
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'), {'nombre': '',   #Una de las variables del post obligatorio va vacía
                                                                   'direccion': "impulsadin",
                                                                   'pais': "Antigua y Barbuda",
                                                                   'idioma': "8992 EN",
                                                                   'estado1': "Saint John's"
                                                                   })
        self.assertEqual(response.status_code,404)   #Mostrar 404

    def test_post_complete(self):   #Prueba si el post es correcto
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('ingresar_muestras'), {'nombre': "Impulse",   #Las variables del post están completas y con valores
                                                                   'direccion': "impulsadin",
                                                                   'pais': "Antigua y Barbuda",
                                                                   'idioma': "8992 EN",
                                                                   'estado1': "Saint John's"
                                                                   })
        self.assertEqual(response.status_code,200)   #Todo correcto

class MuestraEnviarTests(TestCase):   #Casos de prueba para la vista de enviar_muestra
    def create_role_client(self):   #Crear rol en base de datos de tests
        role = Rol()
        role.nombre = "Cliente"
        role.save()
        return role

    def create_user_django(self):   #Crear usuario en tabla usuario de Django
        user = User.objects.create_user('hockey','hockey@lalocura.com','lalocura')
        user.save()
        return user

    def create_IFCUsuario(self):   #Crear usuario de IFC
        i_user = IFCUsuario()
        i_user.user = self.create_user_django()   #Asignar usuario de la tabla User
        i_user.rol = self.create_role_client()   #Asignar rol creado
        i_user.nombre = "Hockey"
        i_user.apellido_paterno = "Lalo"
        i_user.apellido_materno = "Cura"
        i_user.telefono = "9114364"
        i_user.estado = True
        i_user.save()   #Guardar usuario de IFC

    def create_phantom(self):   #Función para crear al usuario fantasma quien creará las ordenes internas
        user = User.objects.create_user('danny_phantom', 'danny@phantom.com', 'phantom')
        user.save()   #Guardar objeto de usuario
        user_phantom = IFCUsuario()
        user_phantom.user = user
        user_phantom.rol = self.create_role_client()
        user_phantom.nombre = "Danny"
        user_phantom.apellido_paterno = "Phantom"
        user_phantom.apellido_materno = "Phantom"
        user_phantom.telefono = "9114364"
        user_phantom.estado = True
        user_phantom.save()   #Guardar usuario de IFC


    def setup(self):   #Función de setUp que crea lo necesario en la base de datos de pruebas para funcionar correctamente
        u1 = IFCUsuario.objects.all().first()
        self.create_phantom()
        u2 = IFCUsuario.objects.all().last()
        c = Cotizacion()   #Crear un objeto de Cotizacion
        c.usuario_c = u1
        c.usuario_v = u2
        c.descuento = 10.00
        c.subtotal = 10000.00
        c.iva = 100.00
        c.total = 1234235.00
        c.status = True
        c.save()   #Guardar la cotización
        a1 = Analisis()   #Crear un objeto de Analisis
        a1.codigo = "A1"
        a1.nombre = "Pest"
        a1.descripcion = "agropecuario"
        a1.precio = 213132423.12
        a1.tiempo = 1
        a1.save()   #Guardar el análisis
        a2 = Analisis()   #Crear un objeto de Analisis
        a2.codigo = "A2"
        a2.nombre = "icida"
        a2.descripcion = "agro"
        a2.precio = 2132423.12
        a2.tiempo = 2
        a2.save()   #Guardar el análisis
        ac1 = AnalisisCotizacion()   #Conectar el análisis con la cotización
        ac1.analisis = a1
        ac1.cotizacion = c
        ac1.cantidad = 10000
        ac1.fecha = datetime.datetime.now().date()
        ac1.save()   #Guardar conexión
        ac2 = AnalisisCotizacion()   #Conectar el análisis con la cotización
        ac2.analisis = a2
        ac2.cotizacion = c
        ac2.cantidad = 100
        ac2.fecha = datetime.datetime.now().date()
        ac2.save()   #Guardar conexión
        otro = Analisis()   #Crear un objeto de Analisis
        otro.codigo = "Otro"
        otro.nombre = "Otro"
        otro.descripcion = "Otro"
        otro.precio = 0.00
        otro.tiempo = 0
        otro.save()   #Guardar el análisis

    def test_no_login(self):   #Prueba si el usuario no ha iniciado sesión
        self.create_role_client()
        response = self.client.get(reverse('muestra_enviar'))
        self.assertEqual(response.status_code,302)

    def test_no_post(self):   #Prueba si no existe metodo post
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.get(reverse('muestra_enviar'))
        self.assertEqual(response.status_code,404)

    def test_post_empty(self):    #Prueba si no se manda nada en el post
        self.create_IFCUsuario()
        self.client.login(username='hockey',password='lalocura')
        response = self.client.post(reverse('muestra_enviar'),{})
        self.assertEqual(response.status_code,404)

    def test_post_incomplete(self):   #Prueba si el post no lleva todo lo que necesita
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
