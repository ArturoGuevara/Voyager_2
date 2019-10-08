from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from .models import IFCUsuario
# Create your views here.

#Vista de Login
def loginView(request):
    return render(request,'admin_usuarios/login.html')

#Controlador login
def verifyLogin(request):
    mail = request.POST['mail']
    password = request.POST['password']
    print(mail)
    print(password)
    try:
        u = User.objects.get(email=mail)
        user = authenticate(request,username=u.username,password=password)
        if user is not None:
            login(request, user)
            print('Login exitoso \n\n')
            return redirect('/cuentas/home/')
        else:
            #Redireccionar error
            return render(request,'admin_usuarios/login.html', {
                'error': 'Correo y/o contraseña incorrectos'
            })
    except:
        #Redireccionar error
        return render(request,'admin_usuarios/login.html', {
            'error': 'Correo y/o contraseña incorrectos'
        })
        return 0


@login_required
def homeView(request):
    ifc_user = IFCUsuario.objects.get(user = request.user)
    return render(request,'admin_usuarios/home.html', {
            'user': ifc_user
    })

@login_required
def logoutControler(request):
    logout(request)
    return redirect('/cuentas/login/')
