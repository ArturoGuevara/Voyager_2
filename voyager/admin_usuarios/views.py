from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login

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
        print(u)
        user = authenticate(request,username=u.username,password=password)
        if user is not None:
            login(request, user)
            print('Login exitoso \n\n')
            return redirect('home/')
        else:
            #Redireccionar error
            print('Mal contraseña \n\n')
            return render(request,'admin_usuarios/login.html', {
                'error': 1
            })
    except:
        #Redireccionar error
        print('No existe el correo \n\n')
        return render(request,'admin_usuarios/login.html', {
            'error': 1
        })
    return 0;

def homeView(request):
    return render(request,'admin_usuarios/home.html')
