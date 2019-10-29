from django.shortcuts import render
from reportes.models import Analisis, Cotizacion, AnalisisCotizacion, Pais
from cuentas.models import IFCUsuario
from django.http import JsonResponse
from django.core import serializers
from django.http import HttpResponse
from django.http import Http404
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth.decorators import login_required
from django.http import Http404
import datetime
import json
from django.shortcuts import redirect
from .forms import AnalisisForma
from django.core.serializers.json import DjangoJSONEncoder

#Esta clase sirve para serializar los objetos de los modelos.
class LazyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, Cotizacion):
            return str(obj)
        return super().default(obj)

# Vista del index
@login_required
def indexView(request):
    return render(request, 'ventas/index.html')

# Create your views here.

# CÁTALOGO DE ANÁLISIS
@login_required
def ver_catalogo(request):
    if request.session.get('success_code', None) == None:
        request.session['success_code'] = 0
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        analisis = Analisis.objects.all()
        paises = Pais.objects.all()
        context = {
            'analisis': analisis,
            'success_code' : request.session['success_code'],
            'paises' : paises
        }
        request.session['success_code'] = 0
        return render(request, 'ventas/catalogo.html', context)
    else: # Si el rol del usuario no es ventas no puede entrar a la página
        raise Http404

@login_required
def cargar_analisis(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        if request.method == 'POST':
            analisis = Analisis.objects.get(id_analisis = id)
            if analisis:
                data = serializers.serialize("json", [analisis], ensure_ascii = False)
                data = data[1:-1]
                return JsonResponse({"data": data})
            else:
                response = JsonResponse({"error": "No existe ese análisis"})
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

@login_required
def editar_analisis(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            analisis = Analisis.objects.get(id_analisis = id)
            if analisis:
                #Que ningún campo esté vacío
                if is_not_empty(request.POST['nombre']) and is_not_empty(request.POST['codigo']) and is_not_empty(request.POST['descripcion']) and is_not_empty(request.POST['precio']) and is_not_empty(request.POST['tiempo']):
                    # Actualizamos campos
                    analisis.nombre = request.POST['nombre']
                    analisis.codigo = request.POST['codigo']
                    analisis.descripcion = request.POST['descripcion']
                    analisis.precio = request.POST['precio']
                    analisis.tiempo = request.POST['tiempo']
                    # Guardamos cambios
                    analisis.save()
                    # Obtenemos los nuevos valores
                    analisis_actualizado = Analisis.objects.get(id_analisis = id)
                    data = serializers.serialize("json", [analisis_actualizado], ensure_ascii = False)
                    data = data[1:-1]
                    # Regresamos información actualizada
                    return JsonResponse({"data": data})
                else:
                    response = JsonResponse({"error": "Campos vacíos"})
                    response.status_code = 500
                    # Regresamos la respuesta de error interno del servidor
                    return response
            else:
                response = JsonResponse({"error": "No existe ese análisis"})
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

@login_required
def borrar_analisis(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            analisis = Analisis.objects.get(id_analisis = id)
            if analisis:
                analisis.delete()
                return HttpResponse('OK')
            else:
                response = JsonResponse({"error": "No existe ese análisis"})
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

# COTIZACIONES



#US V10-10
@login_required
def agregar_analisis(request):
    if request.method == 'POST':    # Verificar que solo se puede acceder mediante un POST
        form = AnalisisForma(request.POST)
        if form.is_valid():         # Verificar si los datos de la forma son validos
           # Tomar los datos por su nombre en el HTML
            n_nombre = form.cleaned_data['nombre']
            n_codigo = form.cleaned_data['codigo']
            n_precio = form.cleaned_data['precio']
            n_descripcion = form.cleaned_data['descripcion']
            n_duracion = form.cleaned_data['duracion']
            n_pais = form.cleaned_data['pais']
            n_unidad_min = form.cleaned_data['unidad_min']
            n_acreditacion = form.cleaned_data['acreditacion']

            n_pais = Pais.objects.get(id_pais=n_pais)
            if n_acreditacion == "0":
                n_acreditacion = False
            else:
                n_acreditacion = True

            newAnalisis = Analisis.objects.create(
                nombre = n_nombre,
                codigo = n_codigo,
                descripcion = n_descripcion,
                precio = n_precio,
                tiempo = n_duracion,
                pais = n_pais,
                unidad_min = n_unidad_min,
                acreditacion = n_acreditacion
            )
            newAnalisis.save()      # Guardar objeto
            request.session['success_code'] = 1
            return redirect('/ventas/ver_catalogo')
        else:
            request.session['success_code'] = -1
            return redirect('/ventas/ver_catalogo')
    else:
        return redirect('/ventas/ver_catalogo')

# Cotizaciones
@login_required
def ver_cotizaciones(request):
    #Vista de cotizaciones del cliente
    context = {}
    if request.session._session:
        usuario_log = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
        if usuario_log.rol.nombre == "Cliente" or usuario_log.rol.nombre == "Ventas" or usuario_log.rol.nombre == "SuperUser":
            if usuario_log.rol.nombre == "Ventas":
                cotizaciones = Cotizacion.objects.filter(usuario_v=usuario_log) #Obtener cotizaciones de usuario ventas
                analisis = Analisis.objects.all()
                clientes = IFCUsuario.objects.filter(rol__nombre="Cliente") #Obtener usuarios tipo cliente
                context = {
                    'analisis': analisis,
                    'cotizaciones': cotizaciones,
                    'clientes': clientes
                }
            elif usuario_log.rol.nombre == "Cliente":
                cotizaciones = Cotizacion.objects.filter(usuario_c=usuario_log) #Obtener cotizaciones de usuario cliente
                context = {
                    'cotizaciones': cotizaciones,
                }
            elif usuario_log.rol.nombre == "SuperUser":
                cotizaciones = Cotizacion.objects.all()
                analisis = Analisis.objects.all()
                clientes = IFCUsuario.objects.filter(rol__nombre="Cliente") #Obtener usuarios tipo cliente
                context = {
                    'analisis': analisis,
                    'cotizaciones': cotizaciones,
                    'clientes': clientes
                }
            return render(request, 'ventas/cotizaciones.html', context)
        else:
            raise Http404

@login_required
def cargar_cot(request):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        if request.method == 'POST':
            # Obtenemos el arreglo de análisis seleccionados para crear cotización
            checked = request.POST.getlist('checked[]')
            if len(checked) != 0 and checked[0] != 'NaN':
                data = []
                # Iteramos en los análisis seleccionados
                for id in checked: #Asignar codigo DHL
                    analisis = Analisis.objects.get(id_analisis = id)
                    if analisis: #Valida si existe y lo añade al array
                        data.append(analisis)
                    else:
                        response = JsonResponse({"error": "No existe ese análisis"})
                        response.status_code = 500
                        # Regresamos la respuesta de error interno del servidor
                        return response
                info = serializers.serialize("json", data, ensure_ascii = False)
                return JsonResponse({"info": info})
            else:
                response = JsonResponse({"error": "No llegaron los análisis seleccionados"})
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


@login_required
def crear_cotizacion(request):
    if request.session._session:   #Revisión de sesión iniciada
        user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
        if not (user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es ventas o super usuario no puede entrar a la página
            raise Http404
        if request.method == 'POST': #Obtención de datos de cotización
            if (request.POST.get('cliente') and request.POST.get('subtotal') and request.POST.get('descuento') and request.POST.get('iva') and request.POST.get('total')):
                checked = request.POST.getlist('checked[]')
                cantidad = request.POST.getlist('cantidades[]')
                if len(checked) != 0 and checked[0] != 'NaN':
                    if len(cantidad) != 0 and cantidad[0] != 'NaN':
                        cliente = IFCUsuario.objects.get(pk=request.POST.get('cliente'))
                        c = Cotizacion()
                        c.usuario_c = cliente
                        c.usuario_v = user_logged
                        c.descuento = request.POST.get('descuento')
                        c.subtotal = request.POST.get('subtotal')
                        c.iva = request.POST.get('iva')
                        c.total = request.POST.get('total')
                        c.status = True
                        c.save()
                        # Iteramos en los análisis seleccionados
                        index = 0
                        for id in checked: #Asignar codigo DHL
                            a = Analisis.objects.get(id_analisis = id)
                            ac = AnalisisCotizacion()
                            ac.analisis = a
                            ac.cotizacion = c
                            ac.cantidad = cantidad[index]
                            ac.fecha = datetime.datetime.now().date()
                            ac.save()
                            index = index + 1
                        response = JsonResponse({"Success": "OK"})
                        response.status_code = 200
                        # Regresamos la respuesta de error interno del servidor
                        return response
                    else:
                        response = JsonResponse({"error": "No llegaron las cantidades de análisis seleccionados"})
                        response.status_code = 500
                        # Regresamos la respuesta de error interno del servidor
                        return response
                else:
                    response = JsonResponse({"error": "No llegaron los análisis seleccionados"})
                    response.status_code = 500
                    # Regresamos la respuesta de error interno del servidor
                    return response
            else:
                response = JsonResponse({"error": "Campos vacíos"})
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


@login_required
def actualizar_cotizacion(request,id):
    if request.session._session:   #Revisión de sesión iniciada
        user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
        if not (user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es ventas o super usuario no puede entrar a la página
            raise Http404
        if request.method == 'POST': #Obtención de datos de los cambios en la cotización
            if (request.POST.get('cliente') and request.POST.get('subtotal') and request.POST.get('descuento') and request.POST.get('iva') and request.POST.get('total')):
                checked = request.POST.getlist('checked[]')
                cantidad = request.POST.getlist('cantidades[]')
                if len(checked) != 0 and checked[0] != 'NaN':
                    if len(cantidad) != 0 and cantidad[0] != 'NaN':
                        cliente = IFCUsuario.objects.get(user__id=request.POST.get('cliente'))
                        edit_cotizacion = Cotizacion.objects.get(id_cotizacion = id)
                        edit_cotizacion.usuario_c = cliente
                        edit_cotizacion.descuento = request.POST.get('descuento')
                        edit_cotizacion.subtotal = request.POST.get('subtotal')
                        edit_cotizacion.iva = request.POST.get('iva')
                        edit_cotizacion.total = request.POST.get('total')
                        edit_cotizacion.status = True
                        edit_cotizacion.save()

                        # Obtenemos la fecha previamente guardada
                        aux = AnalisisCotizacion.objects.filter(cotizacion = edit_cotizacion).first()
                        fecha = aux.fecha
                        # Borramos los análisis previamente guardados para sobreescribirlos
                        AnalisisCotizacion.objects.filter(cotizacion = edit_cotizacion).delete()

                        # Iteramos en los análisis seleccionados
                        index = 0

                        for idAnalisis in checked: #Asignar codigo DHL
                            a = Analisis.objects.get(id_analisis = idAnalisis)
                            # Creamos una nueva entrada y agregamos los nuevos valores
                            ac = AnalisisCotizacion()
                            ac.analisis = a
                            ac.cotizacion = edit_cotizacion
                            ac.cantidad = cantidad[index]
                            ac.fecha = fecha
                            ac.save()
                            index = index + 1
                        response = JsonResponse({"Success": "OK"})
                        response.status_code = 200
                        # Regresamos la respuesta de error interno del servidor
                        return response
                    else:
                        response = JsonResponse({"error": "No llegaron las cantidades de análisis seleccionados"})
                        response.status_code = 500
                        # Regresamos la respuesta de error interno del servidor
                        return response
                else:
                    response = JsonResponse({"error": "No llegaron los análisis seleccionados"})
                    response.status_code = 500
                    # Regresamos la respuesta de error interno del servidor
                    return response
            else:
                response = JsonResponse({"error": "Campos vacíos"})
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

@login_required
def visualizar_cotizacion(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user)  # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":  # Verificar el tipo de usuario logeado
        if request.method == 'POST':
            cotizacion = Cotizacion.objects.get(id_cotizacion = id)    # Cargar cotizacion con id pedido
            if cotizacion:  # Verificar si la cotizacion existe
                analisis_cotizacion = AnalisisCotizacion.objects.filter(cotizacion=cotizacion)  # Cargar registros de tabla analisis_cotizacion
                if analisis_cotizacion:
                    data_analisis = []
                    data_cotizacion_analisis = []
                    data = []

                    for registro in analisis_cotizacion:    # Agregar analisis a vector para enviar
                        #data_analisis.append(registro.analisis)
                        data_cotizacion_analisis.append(serializers.serialize("json", [registro], ensure_ascii = False))
                        data_analisis.append(serializers.serialize("json", [registro.analisis], ensure_ascii = False))


                    #data.append(serializers.serialize("json", [cotizacion], ensure_ascii = False))
                    data.append(serializers.serialize('json', Cotizacion.objects.filter(id_cotizacion = id), cls=LazyEncoder))

                    data.append(serializers.serialize("json", [cotizacion.usuario_c], ensure_ascii = False))

                    data.append(serializers.serialize("json", [cotizacion.usuario_v], ensure_ascii = False))
                    data.append(data_analisis)
                    data.append(data_cotizacion_analisis)

                    response =  JsonResponse({"info": data})
                    response.status_code = 200
                    return response

                else:
                    response = JsonResponse({"error": "La cotización no contiene analisis"})
                    #response.status_code = 500
                    return response
            else:
                response = JsonResponse({"error": "No existe la cotización"})
                response.status_code = 500
                return response     # Si se intenta consultar una cotizacion inexistente, regresar un error
        else:
            response = JsonResponse({"error": "No se puede acceder por éste método"})
            response.status_code = 500
            return response     # Si se intenta enviar por un medio que no sea POST, regresar un error

# EXTRAS



def is_not_empty(data):
    if data != "":
        return True
    else:
        return False
