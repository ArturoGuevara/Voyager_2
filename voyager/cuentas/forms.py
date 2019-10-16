from django import forms
from django.forms import ModelForm
from cuentas.models import IFCUsuario

class ClientForm(ModelForm):
    """
    nombre = forms.CharField(label ="Nombre", max_length = 50)
    apellido_paterno = forms.CharField(label ="Apellido Paterno", max_length = 50)
    apellido_materno = forms.CharField(label ="Apellido Materno", max_length = 50)
    correo = forms.EmailField(label="Correo electrónico", max_length = 100)
    telefono = forms.CharField(label="Teléfono", max_length = 25)
    contraseña = forms.CharField(widget=forms.PasswordInput())
    """
    class Meta:
        model = IFCUsuario
        fields = "__all__"
        exclude = ('user', 'rol', 'contactos')

