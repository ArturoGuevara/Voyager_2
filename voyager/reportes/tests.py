from django.test import TestCase
from django.urls import reverse, resolve
from .forms import codigoDHL
from .views import validacion_dhl, validacion_codigo
from .models import Paquete

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