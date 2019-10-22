from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from .models import IFCUsuario
from reportes.models import OrdenInterna
from django.urls import reverse
from django.http import Http404
from django.core import serializers
from django.http import JsonResponse

# Create your views here.

#Vista de Login
def loginView(request):
    return render(request,'cuentas/login.html')

#Controlador login
def verifyLogin(request):
    mail = request.POST['mail']
    password = request.POST['password']
    try:
        u = User.objects.get(email=mail)
        usr = IFCUsuario.objects.get(user=u)
        state = usr.estado
        user = authenticate(request,username=u.username,password=password)
        if user is not None:
            if state is True:
                login(request, user)
                ifc_user = IFCUsuario.objects.get(user = request.user)
                request.session['username'] = ifc_user.nombre
                request.session['userrole'] = ifc_user.rol.nombre
                return redirect('/cuentas/home/')
            else:
                return render(request,'cuentas/login.html', {
                    'error': 'Correo y/o contraseña incorrectos'
                })
        else:
            #Redireccionar error
            return render(request,'cuentas/login.html', {
                'error': 'Correo y/o contraseña incorrectos'

            })
    except:
        #Redireccionar error
        return render(request,'cuentas/login.html', {
            'error': 'Correo y/o contraseña incorrectos'

        })
        return 0


@login_required
def homeView(request):
    #Aquí se genera la vista de la pagina home del usuario
    return render(request,'cuentas/home.html', {
            #'user': ifc_user
    })

@login_required
def logoutControler(request):
    #Controlador del logout
    logout(request)
    return redirect('/cuentas/logged_out/')

def loggedOut(request):
    # Funcion encargada de mostar la vista para
    return render(request,'cuentas/login.html', {
        'success': 'Sesión cerrada correctamente'
    })




def consultar_usuario(request, id):
    if request.method == 'POST':

        data_ordenes_int = []
        data_ordenes = []
        data = {}

        usuario = IFCUsuario.objects.get(id=id)
        #muestras = Muestra.objects.get(oi = oi)
        if usuario:
            data = serializers.serialize("json", [usuario], ensure_ascii=False)
            data = data[1:-1]

        ordenes_int = OrdenInterna.objects.filter(usuario = usuario).order_by('idOI')
        for o in ordenes_int:
            if o:
                data_ordenes_int.append(o)
            else:
                print("Not exists")
        data_ordenes = serializers.serialize("json", data_ordenes_int, ensure_ascii=False)        
        return JsonResponse({"data": data, "data_ordenes":data_ordenes})


def lista_usuarios(request):
    #View de lista de usuarios
    rol_busqueda = 'Cliente'
    context = {}

    if request.session._session:
        usuario_log = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
        if usuario_log.rol.nombre == "Director": #Verificar que el rol sea válido
            usuarios_dir = IFCUsuario.objects.all()
            context = {'usuarios':usuarios_dir}
        elif usuario_log.rol.nombre == "Contaduria":
            usuarios_cont = IFCUsuario.objects.filter(rol = rol_busqueda)
            context = {'usuarios':usuarios_cont}
        else:
            raise Http404

    return render(request, 'cuentas/usuarios.html', context)
