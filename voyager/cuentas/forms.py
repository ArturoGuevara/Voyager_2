from django import forms
from django.forms import ModelForm
from cuentas.models import IFCUsuario, Empresa

class ClientForm(ModelForm):
    
    correo = forms.EmailField(label="Correo electrónico", max_length = 100)
    contraseña = forms.CharField(widget=forms.PasswordInput(attrs={'class':'form-control'}))
    contraseña2 = forms.CharField(widget=forms.PasswordInput(attrs={'class':'form-control'}))
    empresa = forms.ModelChoiceField(queryset=Empresa.objects.all())
    """
    nombre = forms.CharField(label ="Nombre", max_length = 50)
    apellido_paterno = forms.CharField(label ="Apellido Paterno", max_length = 50)
    apellido_materno = forms.CharField(label ="Apellido Materno", max_length = 50)
    telefono = forms.CharField(label="Teléfono", max_length = 25)
    contraseña = forms.CharField(widget=forms.PasswordInput())
    """

    def __init__(self, *args, **kwargs):
        super().__init__()
        self.fields['correo'].widget.attrs.update({'class': 'form-control','id': 'correo'})
        self.fields['empresa'].widget.attrs.update({'class': 'form-control'})
        #self.fields['contraseña'].widget.attrs.update({'class': 'form-control'})


    class Meta:
        model = IFCUsuario
        fields = "__all__"
        exclude = ('user', 'rol', 'contactos')
        include = ('User__username')
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


