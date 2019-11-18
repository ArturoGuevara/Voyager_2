from django import forms
from .models import OrdenInterna
from django.forms import formset_factory
from django.utils.translation import ugettext_lazy as _

#Form de crear paquete DHL
class codigoDHL(forms.Form):
    codigo_dhl = forms.CharField(label="",max_length=10)
    
    features = forms.ModelMultipleChoiceField(
        queryset = OrdenInterna.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )

# Form de Producto Procesado
class ProductoProcesadoForm(forms.Form):
    numero_muestra = forms.IntegerField
ProcesadoFormSet = formset_factory(ProductoProcesadoForm, extra=1)

class EnviarResultadosForm(forms.Form):
    archivo_resultados = forms.FileField()
    email_destino = forms.EmailField()
    subject = forms.CharField()
    body = forms.CharField()
    muestra = forms.IntegerField()