from django import forms
from django.forms import ModelForm
from cuentas.models import IFCUsuario, Empresa

class ClientForm(ModelForm):

    correo = forms.EmailField(label="Correo electrónico", required = False, max_length = 100)
    contraseña = forms.CharField(widget=forms.PasswordInput(attrs={'class':'form-control'}), required = False, min_length=8)
    contraseña2 = forms.CharField(widget=forms.PasswordInput(attrs={'class':'form-control'}), required = False, min_length=8)
    empresa = forms.ModelChoiceField(queryset=Empresa.objects.all())
    nombre = forms.CharField(required = False, widget=forms.TextInput(attrs={'class':'form-control',
                                                                             'placeholder': 'Juan José'}))

    apellido_paterno = forms.CharField(required = False, widget=forms.TextInput(attrs={'class':'form-control',
                                                                                        'id': 'apellido_paterno',
                                                                                        'placeholder': 'Rodríguez'}))

    apellido_materno = forms.CharField(required = False, widget=forms.TextInput(attrs={'class':'form-control',
                                                                                        'id': 'apellido_materno',
                                                                                        'placeholder': 'Sánchez'}))

    telefono = forms.CharField(required = False, widget=forms.TextInput(attrs={'class':'form-control',
                                                                                 'placeholder': '444346456'}))

    puesto = forms.CharField(required = False, widget=forms.TextInput(attrs={'class':'form-control'}))

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.fields['correo'].widget.attrs.update({'class': 'form-control',
                                                        'id': 'correo',
                                                        'placeholder':'juanrod@gmail.com'
                                                   })
        self.fields['empresa'].widget.attrs.update({'class': 'form-control'})
        self.fields['contraseña'].widget.attrs.update({'class': 'form-control','id':'contraseña'})
        self.fields['contraseña2'].widget.attrs.update({'class': 'form-control','id':'contraseña2'})

        self.fields['correo'].required=False
        self.fields['empresa'].required=False
        self.fields['contraseña'].required=False
        self.fields['contraseña2'].required=False

    class Meta:
        model = IFCUsuario
        fields = "__all__"
        exclude = ('user', 'rol', 'contactos', 'puesto','estado')
