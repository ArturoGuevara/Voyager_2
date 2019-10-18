from django import forms
from django.forms import ModelForm
from cuentas.models import IFCUsuario, Empresa

class ClientForm(ModelForm):
    
    correo = forms.EmailField(label="Correo electrónico", max_length = 100)
    contraseña = forms.CharField(widget=forms.PasswordInput(attrs={'class':'form-control'}),min_length=8)
    contraseña2 = forms.CharField(widget=forms.PasswordInput(attrs={'class':'form-control'}),min_length=8)
    empresa = forms.ModelChoiceField(queryset=Empresa.objects.all())

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.fields['correo'].widget.attrs.update({'class': 'form-control','id': 'correo'})
        self.fields['empresa'].widget.attrs.update({'class': 'form-control'})
        self.fields['contraseña'].widget.attrs.update({'class': 'form-control','id':'contraseña'})
        self.fields['contraseña2'].widget.attrs.update({'class': 'form-control','id':'contraseña2'})


    class Meta:
        model = IFCUsuario
        fields = "__all__"
        exclude = ('user', 'rol', 'contactos', 'puesto','estado')
        widgets={
            'nombre': forms.TextInput(
                attrs={
                    'class':'form-control',
                }
            ),
            'apellido_paterno': forms.TextInput(
                attrs={
                    'class':'form-control',
                    'id': 'apellido_paterno'
                }
            ),
            'apellido_materno': forms.TextInput(
                attrs={
                    'class':'form-control'
                }
            ),
            'telefono': forms.TextInput(
                attrs={
                    'class':'form-control'
                }
            ),
            'puesto': forms.TextInput(
                attrs={
                    'class':'form-control'
                }
            ),
        }


