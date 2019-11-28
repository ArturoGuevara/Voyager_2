from django.shortcuts import render
from reportes.models import Analisis, Cotizacion, AnalisisCotizacion, Pais, Muestra, Paquete, OrdenInterna
from cuentas.models import IFCUsuario, Empresa
from django.contrib.auth.models import User
import requests
from django.http import JsonResponse
from django.core import serializers
from django.http import HttpResponse
from django.template import RequestContext
from django.http import Http404
from django.urls import reverse_lazy
from django.urls import reverse
from django.views import generic
from django.contrib.auth.decorators import login_required
from django.http import Http404
from django.core.exceptions import ValidationError
import urllib.request as urllib
import datetime
import json
import os
import time
import base64
import locale
from django.shortcuts import redirect
from .forms import AnalisisForma
from .forms import ImportarAnalisisForm
from django.core.serializers.json import DjangoJSONEncoder
import random
import csv
from reportes.forms import codigoDHL
from flags.state import flag_enabled
from ventas.VoyagerImporter import Uploader

#Esta clase sirve para serializar los objetos de los modelos.
class LazyEncoder(DjangoJSONEncoder):
    def default(self, obj):
        if isinstance(obj, Cotizacion):
            return str(obj)
        return super().default(obj)

# Vista del index
@login_required
def indexView(request):
    return redirect('/cuentas/home/')

# Create your views here.

# CÁTALOGO DE ANÁLISIS
@login_required
def ver_catalogo(request):
    context = {}
    if request.session.get('success_code', None) == None:
        request.session['success_code'] = 0
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    #if user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser" or user_logged.rol.nombre == "Ventas":
    if 'consultar_catalogo_analisis' in request.session['permissions']:
        if flag_enabled('Modulo_Catalogo', request=request):
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
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser":
        if request.method == 'POST':
            data = []
            analisis = Analisis.objects.get(id_analisis = id)
            pais = Pais.objects.get(pk=analisis.pais.pk)
            if analisis:
                data.append(serializers.serialize("json", [analisis], ensure_ascii = False))
                # data = data[1:-1]
                data.append(serializers.serialize("json", [pais], ensure_ascii = False))
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
    if user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser":
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            analisis = Analisis.objects.get(id_analisis = id)
            if analisis:
                #Que ningún campo esté vacío
                if is_not_empty(request.POST['nombre']) and is_not_empty(request.POST['codigo']) and is_not_empty(request.POST['descripcion']) and is_not_empty(request.POST['precio']) and is_not_empty(request.POST['tiempo'] and is_not_empty(request.POST['tiempo']) and is_not_empty(request.POST['unidad_min']) and is_not_empty(request.POST['pais'])):
                    # Actualizamos campos
                    pais = Pais.objects.get(pk = request.POST['pais'])
                    analisis.nombre = request.POST['nombre']
                    analisis.codigo = request.POST['codigo']
                    analisis.descripcion = request.POST['descripcion']
                    analisis.precio = request.POST['precio']
                    analisis.tiempo = request.POST['tiempo']
                    analisis.unidad_min = request.POST['unidad_min']
                    analisis.pais = pais
                    if request.POST['acreditacion'] == "1":
                        analisis.acreditacion = True
                    else:
                        analisis.acreditacion = False
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
    if user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser":
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
    user_logged = IFCUsuario.objects.get(user = request.user)  # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser": # Validar roles de usuario logeado
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
                n_acreditacion = request.POST['acreditacion']

                n_pais = Pais.objects.get(id_pais=n_pais)
                print(n_acreditacion)
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
    else:
        raise Http404

# Cotizaciones
@login_required
def ver_cotizaciones(request):
    #Vista de cotizaciones del cliente. Esta funcion muestra todas las cotizaciones consultadas en una tabla.
    context = {}
    if request.session._session:
        usuario_log = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
        #if usuario_log.rol.nombre == "Cliente" or usuario_log.rol.nombre == "Ventas" or usuario_log.rol.nombre == "Director" or usuario_log.rol.nombre == "SuperUser":
        if ('consultar_cotizacion' in request.session['permissions']
                or 'visualizar_cotizacion' in request.session['permissions']
        ):
            if flag_enabled('Modulo_Cotizaciones', request=request):
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
                elif usuario_log.rol.nombre == "SuperUser" or usuario_log.rol.nombre == "Director":
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
            if (request.POST.get('cliente') and request.POST.get('subtotal') and request.POST.get('envio') and request.POST.get('total')):
                checked = request.POST.getlist('checked[]')
                cantidad = request.POST.getlist('cantidades[]')
                descuento = request.POST.getlist('descuentos[]')
                iva = request.POST.getlist('ivas[]')
                totales = request.POST.getlist('totales[]')
                if len(checked) != 0 and checked[0] != 'NaN':
                    if len(cantidad) != 0 and cantidad[0] != 'NaN':
                        cliente = IFCUsuario.objects.get(pk=request.POST.get('cliente'))
                        c = Cotizacion()
                        c.usuario_c = cliente
                        c.usuario_v = user_logged
                        c.envio = request.POST.get('envio')
                        c.subtotal = request.POST.get('subtotal')
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
                            ac.restante = cantidad[index]
                            ac.fecha = datetime.datetime.now().date()
                            ac.descuento = descuento[index]
                            ac.iva = iva[index]
                            ac.total = totales[index]
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
        if not (user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="Director" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es ventas o super usuario no puede entrar a la página
            raise Http404
        if request.method == 'POST': #Obtención de datos de los cambios en la cotización
            if (request.POST.get('cliente') and request.POST.get('subtotal') and request.POST.get('envio') and request.POST.get('total')):
                checked = request.POST.getlist('checked[]')
                cantidad = request.POST.getlist('cantidades[]')
                descuento = request.POST.getlist('descuentos[]')
                iva = request.POST.getlist('ivas[]')
                totales = request.POST.getlist('totales[]')
                if len(checked) != 0 and checked[0] != 'NaN':
                    if len(cantidad) != 0 and cantidad[0] != 'NaN':
                        cliente = IFCUsuario.objects.get(pk=request.POST.get('cliente'))
                        edit_cotizacion = Cotizacion.objects.get(id_cotizacion = id)
                        edit_cotizacion.usuario_c = cliente
                        edit_cotizacion.envio = request.POST.get('envio')
                        edit_cotizacion.subtotal = request.POST.get('subtotal')
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
                            ac.restante = cantidad[index]
                            ac.fecha = datetime.datetime.now().date()
                            ac.descuento = descuento[index]
                            ac.iva = iva[index]
                            ac.total = totales[index]
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
    # Esta funcion es para cargar la informacion detallada de una sola cotizacion consultada mostrada por la funcion ver_cotizaciones
    user_logged = IFCUsuario.objects.get(user = request.user)  # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser" or user_logged.rol.nombre == "Cliente"  or user_logged.rol.nombre == "Director":  # Verificar el tipo de usuario logeado
        if request.method == 'POST':
            cotizacion = Cotizacion.objects.get(id_cotizacion = id)    # Cargar cotizacion con id pedido
            empresa = Empresa.objects.get(pk = cotizacion.usuario_c.empresa.pk)
            usuario = User.objects.get(pk = cotizacion.usuario_c.user.pk)
            if cotizacion:  # Verificar si la cotizacion existe
                analisis_cotizacion = AnalisisCotizacion.objects.filter(cotizacion = cotizacion)  # Cargar registros de tabla analisis_cotizacion
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

                    data.append(serializers.serialize("json", [empresa], ensure_ascii = False))
                    data.append(serializers.serialize("json", [usuario], ensure_ascii = False))

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
###############  USV04-04##################

############### USV02-02###################
@login_required
def borrar_cotizacion(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Director" or user_logged.rol.nombre == "SuperUser":
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            cotizacion = Cotizacion.objects.get(id_cotizacion = id)
            if cotizacion:
                cotizacion.status = False
                cotizacion.save()
                return HttpResponse('OK')
            else:
                response = JsonResponse({"error": "No existe esa cotización"})
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
############### USV02-02###################

############### USV16-50 ###################
@login_required
def aceptar_cotizacion(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            cotizacion = Cotizacion.objects.get(id_cotizacion = id)
            if cotizacion:
                cotizacion.aceptado = True
                cotizacion.save()
                return HttpResponse('OK')
            else:
                response = JsonResponse({"error": "No existe esa cotización"})
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
############### USV16-50 ###################

############### USV18-52 ###################
@login_required
def exportar_datos(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # Obtener el tipo de usuario logeado
    """if not (user_logged.rol.nombre == "Ventas"
                or user_logged.rol.nombre == "SuperUser"
                or user_logged.rol.nombre == "Director"
                or user_logged.rol.nombre=="Facturacion"
            ):
        raise Http404"""
    if not ('descargar_csv' in request.session['permissions']):
        raise Http404
    if request.session.get('success_code',None) == None:
        request.session['success_code'] = 0
    context = {'success_code': request.session['success_code'],}
    request.session['success_code'] = 0
    if flag_enabled('Modulo_Catalogo', request=request):
        context = {'success_code': request.session['success_code'], }
    else:
        context = {}
    return render(request, 'ventas/exportar_datos.html',context)

@login_required
def generar_csv_respaldo(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # Obtener el tipo de usuario logeado
    if not (user_logged.rol.nombre == "Ventas"
                or user_logged.rol.nombre == "SuperUser"
                or user_logged.rol.nombre == "Director"
                or user_logged.rol.nombre=="Facturacion"
            ):
        raise Http404
    if request.method != 'POST':
        raise Http404
    if not request.POST.get("table"):
        raise Http404
    table = request.POST["table"]
    all_rows = None
    field_names = []
    if table == "cotizaciones":
        all_rows = Cotizacion.objects.all()
    elif table == "usuarios":
        all_rows = IFCUsuario.objects.all()
    elif table == "muestras":
        all_rows = Muestra.objects.all()
    elif table == "analisis":
        all_rows = Analisis.objects.all()
    elif table == "paquetes":
        all_rows = Paquete.objects.all()
    elif table == "ordenes":
        all_rows = OrdenInterna.objects.all()
    elif table == "empresas":
        all_rows = Empresa.objects.all()
    else:
        raise Http404
    for dicts in all_rows.values():
        field_names = dicts.keys()
        break
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="'+table+'.csv"'
    writer = csv.DictWriter(response,fieldnames=field_names)
    writer.writeheader()
    for row in all_rows.values():
        writer.writerow(row)
    return response

@login_required
def descargar_paquete(request):
    user_logged = IFCUsuario.objects.get(user=request.user)  # Obtener el tipo de usuario logeado
    if not (user_logged.rol.nombre == "Ventas"
                or user_logged.rol.nombre == "SuperUser"
                or user_logged.rol.nombre == "Director"
                or user_logged.rol.nombre=="Facturacion"
            ):
        raise Http404
    if request.method != 'POST':
        raise Http404
    if not request.POST.get("codigo_dhl"):
        raise Http404
    form = codigoDHL(request.POST)
    if not form.is_valid():
        request.session['success_code'] = -1
        return redirect('/ventas/exportar_datos')
    codigo = form.cleaned_data['codigo_dhl']    #Obtiene datos de la form
    paquetes = Paquete.objects.filter(codigo_dhl = codigo)
    paquete = None
    if not paquetes:
        request.session['success_code'] = -1
        return redirect('/ventas/exportar_datos')
    else:
        paquete = paquetes.first()
    field_names = []
    all_rows = Muestra.objects.filter(paquete = paquete)
    for dicts in all_rows.values():
        field_names = dicts.keys()
        break
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="'+codigo+'.csv"'
    writer = csv.DictWriter(response,fieldnames=field_names)
    writer.writeheader()
    for row in all_rows.values():
        writer.writerow(row)
    return response

############### USV19-53 ###################
@login_required
def importar_csv(request): #Importa datos de análisis
    context = {}
    error_log = {}
    if request.method != 'POST': #Si no se envía un post, el acceso es denegado
        raise Http404
    user_logged = IFCUsuario.objects.get(user = request.user)  # Obtener el usuario logeado
    #Si el rol del usuario no es servicio al cliente, director o superusuario, el acceso es denegado
    if not (user_logged.rol.nombre == "Director"):
        raise Http404
    response_code = 0
    if request.method == 'POST':
        if flag_enabled('Importar_Analisis', request=request):
            form = ImportarAnalisisForm(request.POST, request.FILES)
            if form.is_valid():
                error_log, aux = handle_upload_document(request.FILES['csv_analisis'],)
            else:
                raise Http404

    error_count = len(error_log)

    context = {
        'error_count' : error_count,
        'error_log' : error_log,
    }
    return render(request, 'ventas/importar_csv_resultado.html', context)


def handle_upload_document(file): #Esta función guarda el archivo de resultados a enviar
    #Se crea el path donde el archivo se va a almacenar concatnando el nombre del csv con la fecha en la que sube y un número aleatorio
    path = './analisis/csv_analisis'
    path += str(datetime.date.today())
    path += str(int(random.uniform(1,100000))) #Se escribe un nombre de archivo único con la fecha y un número aleatorio
    with open(path, 'wb+') as destination: #Se escribe el archivo en el sistema
        for chunk in file.chunks():
            destination.write(chunk)
    return carga_datos(path), os.remove(path)

def carga_datos(path):  # Esta funcion carga los registros del archivo guardado
    try:
        error_log = Uploader.validate_content(path)  # Valida que los campos sean correctos (consultar VoyagerImporter.py)
    except:
        error_log = 'ERROR'
    if len(error_log) == 0 and error_log != 'ERROR':
        Uploader.upload_content(path)   # Carga los registros del archivo
    return error_log

@login_required
def bloquear_cotizacion(request, id):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Ventas" or user_logged.rol.nombre == "SuperUser":
        # Checamos que el método sea POST
        if request.method == 'POST':
            # Obtenemos el objeto de análisis
            cotizacion = Cotizacion.objects.get(id_cotizacion = id)
            if cotizacion:
                cotizacion.bloqueado = True
                cotizacion.save()
                return HttpResponse('OK')
            else:
                response = JsonResponse({"error": "No existe esa cotización"})
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



# EXTRAS
def is_not_empty(data):
    if data != "":
        return True
    else:
        return False
