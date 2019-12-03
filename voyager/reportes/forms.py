from django import forms
from .models import OrdenInterna, FacturaOI
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

class EditarFactura(forms.Form):
    responsable_pago_fact = forms.CharField(max_length=10000)
    correo_fact = forms.CharField(max_length=10000)
    numero_fact = forms.CharField(max_length=10000, required=False)
    complemento_pago = forms.CharField(max_length=10000, required=False)
    pago_fact = forms.CharField(max_length=10000, required=False)
    orden_compra = forms.CharField(max_length=10000, required=False)
    fecha_fact = forms.CharField(max_length=10000, required=False)
    fecha_envio_factura = forms.CharField(max_length=10000, required=False)
    envio_fact = forms.CharField(max_length=10000, required=False)
    cobro_envio = forms.CharField(max_length=10000, required=False)
    envio_informes = forms.CharField(max_length=10000, required=False)
    cantidad_pagada = forms.DecimalField(max_digits=10,decimal_places=2, required=False)
    oi_id_fact = forms.CharField(max_length=10000, required=False)
