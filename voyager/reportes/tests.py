from django.test import TestCase
from .forms import codigoDHL

# Create your tests here.
class DHLTests(TestCase):
    
    def test_form_dhl_valido(self):
        form_data = {'codigo_dhl': '1234567891'}
        form = codigoDHL(data=form_data)
        self.assertTrue(form.is_valid())

    def test_form_dhl_invalido(self):
        form_data = {'codigo_dhl': '123456789111'}
        form = codigoDHL(data=form_data)
        self.assertFalse(form.is_valid())

    #def test_codigo_error(self):
        
    #def test_codigo_error_numerico(self):

    #def test_codigo_error_caracteres(self):

    #def test_codigo_error_numerico_caracteres(self):

    #def test_codigo_correcto(self):

    

    