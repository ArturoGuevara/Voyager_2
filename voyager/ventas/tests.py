from django.test import TestCase
from reportes.models import Analisis

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