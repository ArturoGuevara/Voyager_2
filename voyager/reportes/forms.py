from django import forms
from .models import OrdenInterna
from django.utils.translation import ugettext_lazy as _

#Form de crear paquete DHL
class codigoDHL(forms.Form):
    codigo_dhl = forms.CharField(label="",max_length=10)
    
    features = forms.ModelMultipleChoiceField(
        queryset = OrdenInterna.objects.all(),
        widget=forms.CheckboxSelectMultiple,
        required=False
    )


class EnviarResultadosForm(forms.Form):
    archivo_resultados = forms.FileField()
    email_destino = forms.EmailField()
    subject = forms.CharField()
    body = forms.CharField()