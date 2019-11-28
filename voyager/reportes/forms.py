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

'''
class FacturacionForm(forms.Form):
        idFactura = models.AutoField(primary_key=True)
        resp_pago = models.CharField(max_length=10000, blank=True, default='')
        correos = models.CharField(max_length=10000, blank=True, default='')
        numero_factura = models.CharField(max_length=10000, blank=True, default='')
        complemento_pago = models.CharField(max_length=10000, blank=True, default='')
        pago_factura = models.CharField(max_length=10000, blank=True, default='')
        orden_compra = models.CharField(max_length=10000, blank=True, default='')
        fecha_factura = models.DateField(default=timezone.now)
        fecha_envio_factura = models.DateField(default=timezone.now)
        envio_factura = models.BooleanField(default=False)
        cobrar_envio = models.BooleanField(default=False)
        envio_informes = models.BooleanField(default=False)
        oi = models.ForeignKey(OrdenInterna, on_delete=models.CASCADE)
'''
