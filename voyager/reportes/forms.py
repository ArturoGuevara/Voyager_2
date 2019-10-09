from django import forms
from .models import OrdenInterna
from django.utils.translation import ugettext_lazy as _

class DateInput(forms.DateInput):
    input_type = 'date'

class OrdenInternaF(forms.ModelForm):
    class Meta:
        model = OrdenInterna
        exclude = ('idOI',)
        widgets = {
            'birth_date': DateInput(),
        }

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)


class infoForma(forms.ModelForm):
    class Meta:
        model = OrdenInterna
        fields = ['fecha_muestreo', 'localidad', 'fechah_recibo', 'fecha_envio', 'guia_envio']


#Esperar a los camaradas de ingreso de muestras
# class muestrasForma(forms.ModelForm):
    


class observacionesForma(forms.ModelForm):
    class Meta:
        model = OrdenInterna
        fields = ['formato_ingreso_muestra', 'idioma_reporte', 'mrl', 'fecha_lab', 'fecha_ei', 'notif_e', 'envio_ti', 'cliente_cr']


class codigoDHL(forms.Form):
    codigo_dhl = forms.CharField(max_length=10)