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
        resp_pago = forms.CharField(max_length=10000)
        correos = forms.CharField(max_length=10000)
        numero_factura = forms.CharField(max_length=10000)
        complemento_pago = forms.CharField(max_length=10000)
        pago_factura = forms.CharField(max_length=10000)
        orden_compra = forms.CharField(max_length=10000)
        fecha_factura = forms.DateField()
        fecha_envio_factura = forms.DateField()
        envio_factura = forms.BooleanField()
        cobrar_envio = forms.BooleanField()
        envio_informes = forms.BooleanField()
        cantidad_pagada = forms.DecimalField(max_digits=10,decimal_places=2)
