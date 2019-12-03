from django.shortcuts import render
from django.http import HttpResponse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.core import serializers
from .models import IFCUsuario,Rol,Empresa,PermisoRol
from reportes.models import OrdenInterna
from django.urls import reverse
from .forms import ClientForm
from django.http import Http404
from django.http import JsonResponse
from django.http import HttpResponseRedirect
from django.contrib.auth.hashers import check_password
from django.contrib.auth import update_session_auth_hash
from flags.state import flag_enabled
# Create your views here.

#Vista del Index
@login_required
def indexView(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Director" or user_logged.rol.nombre=="Facturacion" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
        return render(request,'cuentas/home.html', {'ifc': user_logged})
    return render(request,'cuentas/home.html', {'ifc': user_logged})

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
                permissions = PermisoRol.objects.all().filter(rol=ifc_user.rol)
                list_permissions = []
                for permission in permissions:
                    list_permissions.append(permission.permiso.nombre)
                request.session['permissions'] = list_permissions
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
    user_logged = IFCUsuario.objects.get(user = request.user)
    return render(request,'cuentas/home.html', {'ifc': user_logged})

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
    #View de consulta de información de usuario
    if request.method == 'POST':
        datos = {}
        rol = ""

        if request.session._session:
            usuario_log = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
            if 'visualizar_clientes' in request.session['permissions'] or 'visualizar_usuarios' in request['permissions']:
                usuario = IFCUsuario.objects.get(user=id)   #Obtener usuario al que deseas consultar
                rol = usuario.rol.nombre    #Obtener rol del usuario que deseas consultar
                if usuario:
                    datos = serializers.serialize("json", [usuario], ensure_ascii=False) #Serializar objeto usuario
                    datos = datos[1:-1]
                    user_django = User.objects.get(id=usuario.user.id)
                    mail = user_django.email
                    empresa = Empresa.objects.filter(id = usuario.empresa.id)
                    nombre_empresa = ""
                    if empresa:
                        nombre_empresa = empresa.first().empresa

            else:
                raise Http404

        return JsonResponse({"datos": datos,"rol":rol,"mail":mail,"nombre_empresa": nombre_empresa})

@login_required
def lista_usuarios(request):
    #View de lista de usuarios
    rol_busqueda = "Cliente"
    context = {}

    if request.session._session:
        usuario_log = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
        if 'visualizar_usuarios' in request.session['permissions']: #Verificar que el rol sea válido
            usuarios_dir = IFCUsuario.objects.exclude(rol__nombre='SuperUser').exclude(rol__nombre='Phantom').order_by('user')    #Obtener todos los usuarios
            usuarios_act = IFCUsuario.objects.filter(estado=True).exclude(rol__nombre='SuperUser').exclude(rol__nombre='Phantom').order_by('user')    #Obtener todos los activos
            usuarios_ina = IFCUsuario.objects.filter(estado=False).exclude(rol__nombre='SuperUser').exclude(rol__nombre='Phantom').order_by('user')    #Obtener todos los inactivos
            context = {'usuarios':usuarios_dir, 'activos':usuarios_act, 'inactivos':usuarios_ina}
        elif 'visualizar_clientes' in request.session['permissions']:
            rol = Rol.objects.get(nombre="Cliente")
            usuarios_cont = IFCUsuario.objects.filter(rol = rol).filter(estado=True).order_by('user')  #Obtener usuarios que son clientes
            context = {'usuarios':usuarios_cont}
        else:
            raise Http404

    return render(request, 'cuentas/usuarios.html', context)

@login_required
def lista_clientes(request):
    context = {}
    if request.session._session:
        usuario_log = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
        if not(usuario_log.rol.nombre == "Ventas"
                    or usuario_log.rol.nombre == "Facturacion"
                    or usuario_log.rol.nombre == "Director"
                    or usuario_log.rol.nombre == "SuperUser"
            ):
            raise Http404
        rol = Rol.objects.get(nombre="Cliente")
        usuarios_cont = IFCUsuario.objects.filter(rol = rol).order_by('user')  #Obtener usuarios que son clientes
        context = {'usuarios':usuarios_cont}

    return render(request, 'cuentas/usuarios.html', context)

@login_required
def actualizar_usuario(request):
    #View de actualización de info de usuario
    datos = {}

    user_logged = IFCUsuario.objects.get(user = request.user) #Obtener al usuario
    if not ('bloquear_usuarios' in request.session['permissions']): #Si el rol del usuario no es cliente no puede entrar a la página
        raise Http404
    if request.method == 'POST':
         usuario = IFCUsuario.objects.filter(user = request.POST['id']).first()
         if usuario:
            usuario.estatus_pago = request.POST['estatus'] #Actualizar campos
            usuario.save()
            usuario_actualizado = IFCUsuario.objects.get(user = request.POST['id'])#Cargar de nuevo la info de usuario
            datos = serializers.serialize("json", [usuario_actualizado], ensure_ascii = False)
            datos = datos[1:-1]
            return JsonResponse({"datos": datos}) # Regresamos información actualizada en un json

@login_required
def crear_cliente(request):
    form = ClientForm()
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not (user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crear_cliente' in request.session['permissions']):
        raise Http404
    return render(request, 'cuentas/crear_cliente.html', {'form' : form})

@login_required
def guardar_cliente(request):
    if not request.session._session:
        raise Http404
    if request.method != 'POST':
        raise Http404
    if not (request.POST.get('nombre')
            and request.POST.get('contraseña')
            and request.POST.get('contraseña2')
            and request.POST.get('empresa')
            and request.POST.get('correo')
            and request.POST.get('apellido_paterno')
            and request.POST.get('apellido_materno')
            and request.POST.get('telefono')
        ): #verificar que se envían todos los datos
        request.session['crear_cliente_status'] = False
        raise Http404
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not(user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crear_cliente' in request.session['permissions']):
        request.session['crear_cliente_status'] = False
        raise Http404
    user_name = request.POST.get('nombre')[0:2] \
                + request.POST.get('apellido_paterno')[0:2] \
                + request.POST.get('apellido_materno')[0:2] \
                + str(IFCUsuario.objects.all().count()) #crear un username único para el usuario tomando las 2 primeras
                # letras del nombre y cada apellido más el número de usuarios en el sistema
    if (request.POST.get('contraseña') != request.POST.get('contraseña2')): #verificar que las contraseñas sean iguales
        request.session['crear_cliente_status'] = False
        raise Http404
    num_mails = User.objects.filter(email=request.POST.get('correo'))
    if num_mails.count() > 0: #verificar que no haya usuarios con el mismo correo
        request.session['crear_cliente_status'] = False
        raise Http404
    empresa = Empresa.objects.filter(id=request.POST.get('empresa'))
    if not empresa: #verificar que exista una empresa con el código enviado
        request.session['crear_cliente_status'] = False
        raise Http404
    user = User.objects.create_user(user_name, request.POST.get('correo'), request.POST.get('contraseña'))
    user.save()
    new_client = IFCUsuario()
    new_client.rol = Rol.objects.get(nombre="Cliente")
    new_client.user = user
    new_client.nombre = request.POST.get('nombre')
    new_client.apellido_paterno = request.POST.get('apellido_paterno')
    new_client.apellido_materno = request.POST.get('apellido_materno')
    new_client.telefono = request.POST.get('telefono')
    new_client.estado = True
    new_client.empresa = empresa.first()
    new_client.save() #guardar nuevo cliente
    request.session['crear_cliente_status'] = True
    return redirect('/cuentas/usuarios') #redirigir a home

@login_required
def verificar_correo(request):
    query_mails = User.objects.filter(email=request.POST.get('correo'))
    return JsonResponse({"num_mails": query_mails.count()})

@login_required
def crear_staff(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    if not ('crear_usuario' in request.session['permissions']):  # verificar que el usuario pertenezca al grupo con permisos
        raise Http404
    roles = Rol.objects.all()
    return render(request, 'cuentas/crear_staff.html', {'roles' : roles})

@login_required
def guardar_staff(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    if not (user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser"):  # verificar que el usuario pertenezca al grupo con permisos
        raise Http404
    if request.method != 'POST':
        raise Http404
    if not (request.POST.get('nombre')
            and request.POST.get('contraseña')
            and request.POST.get('contraseña2')
            and request.POST.get('correo')
            and request.POST.get('apellido_paterno')
            and request.POST.get('apellido_materno')
            and request.POST.get('telefono')
            and request.POST.get('id_rol')
        ): #verificar que se envían todos los datos
        request.session['crear_staff_status'] = False
        return redirect('/cuentas/usuarios')

    user_name = request.POST.get('nombre')[0:2] \
                + request.POST.get('apellido_paterno')[0:2] \
                + request.POST.get('apellido_materno')[0:2] \
                + str(IFCUsuario.objects.all().count()) #crear un username único para el usuario tomando las 2 primeras
                # letras del nombre y cada apellido más el número de usuarios en el sistema

    if (len(request.POST.get('contraseña')) < 8):   # Verificar que la contrasena sea mayor o igual a 8 caracteres
        request.session['crear_staff_status'] = False
        return redirect('/cuentas/usuarios')

    if (request.POST.get('contraseña') != request.POST.get('contraseña2')): #verificar que las contraseñas sean iguales
        request.session['crear_staff_status'] = False
        return redirect('/cuentas/usuarios')

    num_mails = User.objects.filter(email=request.POST.get('correo'))
    if num_mails.count() > 0: #verificar que no haya usuarios con el mismo correo
        request.session['crear_staff_status'] = False
        return redirect('/cuentas/usuarios')

    empresa = Empresa.objects.get(empresa='IFC')

    rol_n = Rol.objects.get(id=request.POST.get('id_rol'))

    user = User.objects.create_user(user_name, request.POST.get('correo'), request.POST.get('contraseña'))
    user.save()

    new_client = IFCUsuario.objects.create(
        rol = rol_n,
        user = user,
        nombre = request.POST.get('nombre'),
        apellido_paterno = request.POST.get('apellido_paterno'),
        apellido_materno = request.POST.get('apellido_materno'),
        telefono = request.POST.get('telefono'),
        estado = True,
        empresa = empresa,
    )
    new_client.save()
    request.session['crear_staff_status'] = True
    return redirect('/cuentas/usuarios')

@login_required
def notificar_crear_staff(request):         # Funcion que se llama con un ajax para dar retroalimentacion al usuario al crear staff
    if 'crear_staff_status' in request.session:
        result = request.session['crear_staff_status']
        del request.session['crear_staff_status']
        return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'NONE'})

@login_required
def notificar_crear_cliente(request):         # Funcion que se llama con un ajax para dar retroalimentacion al usuario al crear staff
    if 'crear_cliente_status' in request.session:
        result = request.session['crear_cliente_status']
        del request.session['crear_cliente_status']
        return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'NONE'})

@login_required
def guardar_perfil(request):
    if not request.session._session:
        raise Http404
    if request.method != 'POST':
        raise Http404
    if not (request.POST.get('nombre')
            and request.POST.get('a_p')
            and request.POST.get('a_m')
            and request.POST.get('correo')
            and request.POST.get('telefono')
            and request.POST.get('ver')
        ): #verificar que se envían todos los datos
        request.session['guardar_perfil_status'] = False
        return redirect('/cuentas/home/') #redirigir a home
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    num_mails = User.objects.filter(email=request.POST.get('correo'))
    total = 0
    for u in num_mails:
        if (u.pk == user_logged.user.pk):
            total = 1
    if num_mails.count() > total: #verificar que no haya usuarios con el mismo correo
        request.session['guardar_perfil_status'] = False
        return redirect('/cuentas/home/') #redirigir a home
    if not (check_password(request.POST.get('ver'), user_logged.user.password)):
        request.session['error_perfil_status'] = True
        return redirect('/cuentas/home/') #redirigir a home
    user = user_logged.user
    user.email = request.POST.get('correo')
    if (request.POST.get('pass1') != "" and request.POST.get('pass2') != ""):
        if (request.POST.get('pass1') == request.POST.get('pass2')): #verificar que las contraseñas sean iguales
            user.set_password(request.POST.get('pass1'))
        else:
            request.session['guardar_perfil_status'] = False
            return redirect('/cuentas/home/') #redirigir a home
    user.save()
    update_session_auth_hash(request, user)
    user_logged.nombre = request.POST.get('nombre')
    user_logged.apellido_paterno = request.POST.get('a_p')
    user_logged.apellido_materno = request.POST.get('a_m')
    user_logged.telefono = request.POST.get('telefono')
    user_logged.save() #guardar nuevo cliente
    request.session['guardar_perfil_status'] = True
    return redirect('/cuentas/home/') #redirigir a home

@login_required
def notificar_guardar_perfil(request):         # Funcion que se llama con un ajax para dar retroalimentacion al usuario al crear staff
    if 'guardar_perfil_status' in request.session:
        result = request.session['guardar_perfil_status']
        del request.session['guardar_perfil_status']
        return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'NONE'})

@login_required
def notificar_error_perfil(request):         # Funcion que se llama con un ajax para dar retroalimentacion al usuario al crear staff
    if 'error_perfil_status' in request.session:
        result = request.session['error_perfil_status']
        del request.session['error_perfil_status']
        return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'NONE'})
############### USA03-39###################
@login_required
def borrar_usuario(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    #if user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser":
    if 'eliminar_usuario' in request.session['permissions']:
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            usuario = IFCUsuario.objects.get(user__pk = id)
            if usuario:
                usuario.estado = not usuario.estado
                usuario.save()
                return HttpResponse('OK')
            else:
                response = JsonResponse({"error": "No existe ese usuario"})
                response.status_code = 500
                # Regresamos la respuesta de error interno del servidor
                return response
        else:
            response = JsonResponse({"error": "No se mandó por el método correcto"})
            response.status_code = 500
            # Regresamos la respuesta de error interno del servidor
            return response
    else: # Si el rol del usuario no es ventas no puede entrar a la página
        raise Http404
############### USA03-39###################


########### CRUD empresa ##################
@login_required
def crear_empresa(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not(user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crud_empresa' in request.session['permissions']):
        raise Http404
    if not (request.POST.get('nombre_empresa')
            and request.POST.get('telefono_empresa')
            and request.POST.get('correo_resultados')
            and request.POST.get('correo_pagos')
            and request.POST.get('nombre_responsable_resultados')
            and request.POST.get('nombre_responsable_pagos')
        ):
        raise Http404
    nombre_empresa = request.POST.get('nombre_empresa')
    telefono_empresa = request.POST.get('telefono_empresa')
    correo_resultados = request.POST.get('correo_resultados')
    correo_pagos = request.POST.get('correo_pagos')
    nombre_responsable_resultados = request.POST.get('nombre_responsable_resultados')
    nombre_responsable_pagos = request.POST.get('nombre_responsable_pagos')
    empresas_nombre = Empresa.objects.filter(empresa = nombre_empresa)
    if empresas_nombre:
        raise Http404
    empresa = Empresa()
    empresa.empresa = nombre_empresa
    empresa.telefono = telefono_empresa
    empresa.correo_resultados = correo_resultados
    empresa.correo_pagos = correo_pagos
    empresa.responsable_resultados = nombre_responsable_resultados
    empresa.responsable_pagos = nombre_responsable_pagos
    empresa.save()
    return JsonResponse({'value':empresa.id,'nombre':empresa.empresa})

@login_required
def lista_empresas(request):
    empresas = {}
    context = {}

    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not(user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crud_empresa' in request.session['permissions']):
        raise Http404
    if flag_enabled('Modulo_Empresas', request=request):
        empresas = Empresa.objects.filter(estado=True)
        context = {'empresas':empresas}
    return render(request, 'cuentas/lista_empresas.html', context)

@login_required
def consultar_empresa(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not(user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crud_empresa' in request.session['permissions']):
        raise Http404
    if not (request.POST.get('id')):
        raise Http404
    id_empresa = request.POST.get('id')
    empresas = Empresa.objects.filter(id=id_empresa)
    if not empresas:
        raise Http404
    empresa = empresas.first()
    return JsonResponse({'nombre':empresa.empresa,
                            'telefono':empresa.telefono,
                            'correo_resultados':empresa.correo_resultados,
                            'correo_pagos':empresa.correo_pagos,
                            'id':empresa.id,
                            'responsable_resultados':empresa.responsable_resultados,
                            'responsable_pagos':empresa.responsable_pagos,
                         })

@login_required
def editar_empresa(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not(user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crud_empresa' in request.session['permissions']):
        raise Http404
    if not (request.POST.get('editar_nombre')
            and request.POST.get('editar_telefono')
            and request.POST.get('editar_responsable_resultados')
            and request.POST.get('editar_correo_resultados')
            and request.POST.get('editar_responsable_pagos')
            and request.POST.get('editar_correo_pagos')
            and request.POST.get('empresa_id')
        ):
        raise Http404
    nombre_empresa = request.POST.get('editar_nombre')
    telefono_empresa = request.POST.get('editar_telefono')
    responsable_resultados = request.POST.get('editar_responsable_resultados')
    correo_resultados = request.POST.get('editar_correo_resultados')
    responsable_pagos = request.POST.get('editar_responsable_pagos')
    correo_pagos = request.POST.get('editar_correo_pagos')
    id_empresa = request.POST.get('empresa_id')
    empresas = Empresa.objects.filter(id=id_empresa)
    if not empresas:
        raise Http404
    empresa = empresas.first()
    empresa.empresa = nombre_empresa
    empresa.telefono = telefono_empresa
    empresa.responsable_resultados = responsable_resultados
    empresa.correo_resultados = correo_resultados
    empresa.responsable_pagos = responsable_pagos
    empresa.correo_pagos = correo_pagos
    empresa.save()
    request.session['editar_empresa'] = True
    return HttpResponseRedirect(reverse('lista_empresas'))

@login_required
def eliminar_empresa(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # obtener usuario que inició sesión
    #if not(user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre == "Director"):  # verificar que el usuario pertenezca al grupo con permisos
    if not ('crud_empresa' in request.session['permissions']):
        raise Http404
    if not (request.POST.get('eliminar_empresa_id')):
        raise Http404
    id_empresa = request.POST.get('eliminar_empresa_id')
    empresas = Empresa.objects.filter(id=id_empresa)
    if not empresas:
        raise Http404
    empresa = empresas.first()
    #empresa.delete()
    empresa.empresa=""
    empresa.telefono=""
    empresa.responsable_resultados=""
    empresa.correo_resultados=""
    empresa.responsable_pagos=""
    empresa.correo_pagos=""
    empresa.estado=False
    empresa.save()
    request.session['borrar_empresa'] = True
    return HttpResponseRedirect(reverse('lista_empresas'))

@login_required
def notificar_editar_empresa(request):         # Funcion que se llama con un ajax para dar retroalimentacion al usuario al crear staff
    if 'editar_empresa' in request.session:
        result = request.session['editar_empresa']
        del request.session['editar_empresa']
        return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'NONE'})

@login_required
def notificar_borrar_empresa(request):         # Funcion que se llama con un ajax para dar retroalimentacion al usuario al crear staff
    if 'borrar_empresa' in request.session:
        result = request.session['borrar_empresa']
        del request.session['borrar_empresa']
        return JsonResponse({"result": result})
    else:
        return JsonResponse({"result": 'NONE'})
