from django import forms
from procesamiento_reportes.models import OrdenInterna
from django.utils.translation import ugettext_lazy as _

class DateInput(forms.DateInput):
    input_type = 'date'

class OrdenInternaF(forms.ModelForm):
    class Meta:
        model = OrdenInterna

        widgets = {
            'birth_date': DateInput(),
        }

        def __init__(self, *args, **kwargs):
            super().__init__(*args, **kwargs)
