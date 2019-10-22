from django import forms
from reportes.models import Analisis

# Forma de crear Analisis del catalogo
class AnalisisForma(forms.Form):
    nombre = forms.CharField(max_length=100)
    descripcion = forms.CharField(max_length=100)
    codigo = forms.CharField(max_length=50)
    precio = forms.DecimalField(max_digits=30,decimal_places=2)
    unidad_min = forms.CharField(max_length=50)
    duracion = forms.CharField(max_length=15) #numero de dias que toma el análisis
    pais = forms.DecimalField(max_digits=3)
    acreditacion = forms.BooleanField()
