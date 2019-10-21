from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from .models import IFCUsuario,Rol,Empresa
from django.urls import reverse
from .forms import ClientForm
from django.http import Http404
from django.http import JsonResponse
from django.http import HttpResponseRedirect
# Create your views here.

#Vista del Index
@login_required
def indexView(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Director" or user_logged.rol.nombre=="Facturacion" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
        return render(request,'cuentas/home.html')
    return render(request, 'cuentas/index.html')

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

@login_required
def crear_cliente(request):
    form = ClientForm()
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    if not user_logged.rol.nombre == "Ventas":  # verificar que el usuario pertenezca al grupo con permisos
        raise Http404
    return render(request, 'cuentas/crear_cliente.html', {'form' : form})

@login_required
def guardar_cliente(request):
    if request.session._session:
        if request.method == 'POST':
                if (request.POST.get('nombre')
                    and request.POST.get('contraseña')
                    and request.POST.get('contraseña2')
                    and request.POST.get('empresa')
                    and request.POST.get('correo')
                    and request.POST.get('apellido_paterno')
                    and request.POST.get('apellido_materno')
                    and request.POST.get('telefono')
                ):
                    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
                    if not user_logged.rol.nombre == "Ventas": #verificar que el usuario pertenezca al grupo con permisos
                        raise Http404
                    user_name = request.POST.get('nombre')[0:2]\
                                +request.POST.get('apellido_paterno')[0:2]\
                                +request.POST.get('apellido_materno')[0:2]\
                                +str(IFCUsuario.objects.all().count())
                    if(request.POST.get('contraseña')==request.POST.get('contraseña2')):
                        num_mails = User.objects.filter(email=request.POST.get('correo'))
                        if num_mails.count()>0:
                            raise Http404
                        user = User.objects.create_user(user_name,request.POST.get('correo'),request.POST.get('contraseña'))
                        user.save()
                        new_client = IFCUsuario()
                        new_client.rol = Rol.objects.get(nombre="Cliente")
                        new_client.user = user
                        new_client.nombre = request.POST.get('nombre')
                        new_client.apellido_paterno = request.POST.get('apellido_paterno')
                        new_client.apellido_materno = request.POST.get('apellido_materno')
                        new_client.telefono = request.POST.get('telefono')
                        new_client.estado = True
                        empresa = Empresa.objects.filter(id=request.POST.get('empresa'))
                        if empresa:
                            new_client.empresa = empresa.first()
                            new_client.save()
                            return HttpResponseRedirect(reverse("home"))
                        else:
                            raise Http404
                    else:
                        raise Http404
                else:
                    raise Http404
        else:
            raise Http404
    else:
        raise Http404

@login_required
def verificar_correo(request):
    query_mails = User.objects.filter(email=request.POST.get('correo'))
    return JsonResponse({"num_mails": query_mails.count()})