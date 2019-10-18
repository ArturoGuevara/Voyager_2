from django import forms
from reportes.models import Analisis

# Forma de crear Analisis del catalogo
class AnalisisForma(forms.Form):
    codigo = forms.CharField(max_length=50)
    nombre = forms.CharField(max_length=100)
    descripcion = forms.CharField(max_length=100)
    precio = forms.DecimalField(max_digits=30,decimal_places=2)
    duracion = forms.CharField(max_length=15) #numero de dias que toma el análisis
