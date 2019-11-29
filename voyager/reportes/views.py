from django.shortcuts import render, get_object_or_404
from django.core import serializers
from .models import OrdenInterna, Paquete
from .forms import codigoDHL
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from urllib.parse import urlencode
import requests
import json
from ventas.models import Factura
from .models import AnalisisCotizacion,Cotizacion,AnalisisMuestra,Muestra,Analisis,FacturaOI
from cuentas.models import IFCUsuario
from django.http import Http404
import datetime
from datetime import date
from django.http import HttpResponseRedirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.template import RequestContext
from django.core.exceptions import ValidationError
from .forms import EnviarResultadosForm
import os
import time
import random
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import (Mail, Attachment, FileContent, FileName,FileType, Disposition, ContentId)
import urllib.request as urllib
import base64
import locale
from flags.state import flag_enabled

# Create your views here.
@login_required   #Redireccionar a login si no ha iniciado sesión
def ingreso_cliente(request):
    if request.session._session:   #Revisión de sesión iniciada
        user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
        if not (user_logged.rol.nombre=="Cliente" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
            raise Http404
        if user_logged.estatus_pago=="Bloqueado":   #Si el estatus del usuario es bloqueado no puede hacer ingreso de muestras
            context = {
                'titulo': "Usted no puede realizar ingreso de muestras en este momento",
                'mensaje': "Contacte al administrador para volver a despegar con nosotros",
            }
            return render(request, 'reportes/bloqueado.html')
        else:
            cotizaciones = Cotizacion.objects.filter(usuario_c = user_logged, status=True, aceptado=True, bloqueado=False)
            if not cotizaciones:
                context = {
                    'titulo': "Usted no tiene cotizaciones en este momento",
                    'mensaje': "Contacte a IFC para volver a despegar con nosotros",
                }
                return render(request, 'reportes/bloqueado.html', context)
            analisis = Analisis.objects.filter(id_analisis="-1") #Query que no da ningún análisis
            for c in cotizaciones:
                cot = AnalisisCotizacion.objects.filter(cotizacion = c) #Busca los AnalisisCotizacion que pertenecen a la Cotizacion
                for a in cot:
                    analisis_temp = Analisis.objects.filter(id_analisis = a.analisis.id_analisis)#Busca el Analisis que tiene el AnalisisCotizacion
                    analisis = analisis | analisis_temp
            context = {
                'analisis': analisis
            }
            return render(request, 'reportes/ingreso_muestra.html', context)
    else:
        raise Http404

@login_required
def registrar_ingreso_muestra(request):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Cliente" or user_logged.rol.nombre == "SuperUser":
        if request.method == 'POST':
            if(request.POST.get('nombre') and request.POST.get('direccion') and request.POST.get('pais') and request.POST.get('estado') and request.POST.get('idioma')):
                nombre = request.POST.get('nombre')
                direccion = request.POST.get('direccion')
                pais = request.POST.get('pais')
                estado = request.POST.get('estado')
                idioma = request.POST.get('idioma')
                matrixAG = request.POST.getlist('matrixAG[]')
                matrixPR = request.POST.getlist('matrixPR[]')
                matrixMB = request.POST.getlist('matrixMB[]')
                oi = OrdenInterna() #Crear orden Interna a la que se asignarán todas las muestras
                oi.usuario = user_logged
                oi.estatus = "Creada"
                oi.save()
                if matrixAG[0] != '' or matrixPR[0] != '' or matrixMB[0] != '':
                    if matrixAG[0] != '':
                        if not guardar_muestras(matrixAG,"AG",user_logged, oi): #Llamar a la función que guarda datos, regresa false si hubo un error
                            response = JsonResponse({"error": "No llegaron los datos correctamente"})
                            response.status_code = 500
                            oi.delete() #Tanto la orden interna como los objetos derivados de ella se borran
                            return response
                    if matrixPR[0] != '':
                        if not guardar_muestras(matrixPR,"PR",user_logged, oi):
                            response = JsonResponse({"error": "No llegaron los datos correctamente"})
                            response.status_code = 500
                            oi.delete()
                            return response
                    if matrixMB[0] != '':
                        if not guardar_muestras(matrixMB,"MB",user_logged, oi):
                            response = JsonResponse({"error": "No llegaron los datos correctamente"})
                            response.status_code = 500
                            oi.delete()
                            return response
                    response = JsonResponse({"Success": "OK"})
                    response.status_code = 200
                    return response
                else:
                    response = JsonResponse({"error": "Las matrices llegaron vacías"})
                    response.status_code = 500 # Regresamos la respuesta de error interno del servidor
                    oi.delete()
                    return response
            else:
                response = JsonResponse({"error": "No llegaron los datos correctamente"})
                response.status_code = 500 # Regresamos la respuesta de error interno del servidor
                return response
        else:
            response = JsonResponse({"error": "No se mandó por el método correcto"})
            response.status_code = 404 # Regresamos la respuesta de error interno del servidor
            return response
    else: # Si el rol del usuario no es ventas no puede entrar a la página
        raise Http404

def guardar_muestras(arreglo, tipo, user, oi):
    formato = arreglo
    if tipo == "AG":
        li = list(formato[0].split(","))
        for i in range (len(li)): #Cuenta cuántas muestras de tipo AG fueron ingresadas
            m = Muestra()
            # GENERALES
            m.usuario = user
            m.oi = OrdenInterna.objects.latest('idOI')
            li = list(formato[0].split(","))
            m.producto = li[i]
            li = list(formato[1].split(","))
            m.variedad = li[i]
            li = list(formato[2].split(","))
            m.pais_origen = li[i]
            li = list(formato[3].split(","))
            m.codigo_muestra = li[i]
            li = list(formato[4].split(","))
            m.proveedor = li[i]
            li = list(formato[5].split(","))
            m.codigo_trazabilidad = li[i]
            li = list(formato[6].split(","))
            m.agricultor = li[i]
            li = list(formato[7].split(","))
            m.direccion = li[i]
            li = list(formato[8].split(","))
            m.parcela = li[i]
            li = list(formato[9].split(","))
            m.ubicacion_muestreo = li[i]
            li = list(formato[10].split(","))
            try:
                fm = datetime.datetime.strptime(li[i], "%m/%d/%Y").strftime("%Y-%m-%d")
            except ValueError:
                return False
            m.fecha_muestreo = fm
            li = list(formato[11].split(","))
            m.urgente = li[i]
            li = list(formato[12].split(","))
            m.muestreador = li[i]
            li = list(formato[13].split(","))
            m.pais_destino = li[i]
            m.save()
            li = list(formato[14].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[15].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[16].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[17].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[18].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[19].split(","))
            restar_analisis(user, li[i], m, oi)
    elif tipo == "PR":
        li = list(formato[0].split(","))
        for i in range (len(li)): #Cuenta cuántas muestras de tipo PR fueron ingresadas
            m = Muestra()
            # GENERALES
            m.usuario = user
            m.oi = OrdenInterna.objects.latest('idOI')
            li = list(formato[0].split(","))
            m.tipo_muestra = li[i]
            li = list(formato[1].split(","))
            m.descripcion_muestra = li[i]
            li = list(formato[2].split(","))
            try:
                fm = datetime.datetime.strptime(li[i], "%m/%d/%Y").strftime("%Y-%m-%d")
            except ValueError:
                return False
            m.fecha_muestreo = fm
            m.save()
            li = list(formato[3].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[4].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[5].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[6].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[7].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[8].split(","))
            restar_analisis(user, li[i], m, oi)
    elif tipo == "MB":
        li = list(formato[0].split(","))
        for i in range (len(li)): #Cuenta cuántas muestras de tipo MB fueron ingresadas
            m = Muestra()
            # GENERALES
            m.usuario = user
            m.oi = OrdenInterna.objects.latest('idOI')
            li = list(formato[0].split(","))
            m.tipo_muestra = li[i]
            li = list(formato[1].split(","))
            m.lote_codigo = li[i]
            li = list(formato[2].split(","))
            m.muestreador = li[i]
            li = list(formato[3].split(","))
            try:
                fm = datetime.datetime.strptime(li[i], "%m/%d/%Y").strftime("%Y-%m-%d")
            except ValueError:
                return False
            m.fecha_muestreo = fm
            li = list(formato[4].split(","))
            m.metodo_referencia = li[i]
            m.save()
            li = list(formato[5].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[6].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[7].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[8].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[9].split(","))
            restar_analisis(user, li[i], m, oi)
            li = list(formato[10].split(","))
            restar_analisis(user, li[i], m, oi)
    return True #De llegar hasta aquí, significa que todas las muestras se guardaron correctamente

def restar_analisis(user, analisis, muestra, oi):
    cotizaciones = Cotizacion.objects.filter(usuario_c = user)
    for c in cotizaciones:
        ac = AnalisisCotizacion.objects.filter(cotizacion = c) #Busca los AnalisisCotizacion que pertenecen a la Cotizacion
        for a in ac:
            if a.analisis.id_analisis == int(analisis): #Revisar que el AnalisisCotizacion tenga el análisis que se va a registrar
                if a.restante > 0: #Revisar que aún le queden análisis
                    a.restante -= 1
                    am = AnalisisMuestra()
                    am.id_oi = oi
                    am.id_analisis_cotizacion = a
                    am.analisis = Analisis.objects.get(id_analisis = analisis)
                    am.muestra = muestra
                    am.estado = True
                    am.fecha = date.today()
                    am.save()
                    a.save()
                    return True
    cotizaciones = Cotizacion.objects.filter(usuario_c = user).order_by('-id_cotizacion')#Si no quedaron análisis cotizados, se restarán de la cotización del cliente más reciente
    for c in cotizaciones:
        ac = AnalisisCotizacion.objects.filter(cotizacion = c)
        for a in ac:
            if a.analisis.id_analisis == int(analisis): #Revisar que el AnalisisCotizacion tenga el análisis que se va a registrar
                a.restante -= 1
                am = AnalisisMuestra()
                am.id_oi = oi
                am.id_analisis_cotizacion = ac
                am.analisis = Analisis.objects.get(id_analisis = analisis)
                am.muestra = muestra
                am.estado = True
                am.fecha = date.today()
                am.save()
                a.save()
                return True

@login_required
def indexView(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    return redirect('/cuentas/home/')

@login_required
def ordenes_internas(request):
    ordenes = {}
    ordenes_activas = {}
    dict_clientes = {}
    dict_muestras = {}
    form = None
    response = None

    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Director" or user_logged.rol.nombre=="Soporte" or user_logged.rol.nombre=="Facturacion" or user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
        raise Http404
    if request.session.get('success_sent',None) == None:
        request.session['success_sent']=0
    estatus_OI_paquetes = "Resultados"  #Estatus a buscar de OI para crear paquete
    if flag_enabled('Modulo_Ordenes_Internas', request=request):
        ordenes = OrdenInterna.objects.all()
        ordenes_activas = OrdenInterna.objects.exclude(estatus=estatus_OI_paquetes).order_by('idOI')
        for orden in ordenes_activas:
            arr_muestras = []
            muestras_orden = Muestra.objects.filter(oi=orden)
            for muestra in muestras_orden:
                arr_muestras.append(muestra)

            if muestras_orden:
                print(arr_muestras)
                dict_clientes[orden] = muestras_orden.first().usuario
                dict_muestras[orden] = arr_muestras.copy()
            arr_muestras.clear()
        form = codigoDHL()

        response = request.GET.get('successcode') #Recibe codigo de validacion_codigo view

    context = {
        'ordenes': ordenes,
        'ordenes_activas': ordenes_activas,
        'form': form,
        'successcode': response,
        'success_sent': request.session['success_sent'],
        'ordenes_clientes': dict_clientes,
        'muestras': dict_muestras,
    }
    request.session['success_sent'] = 0
    return render(request, 'reportes/ordenes_internas.html', context)

@login_required
def oi_guardar(request, form, template_name):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Soporte" or user_logged.rol.nombre=="Facturacion" or user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
        raise Http404
    data = dict()
    if request.method == 'POST':
        id = id
        oi = OrdenInterna.objects.get(idOI=id)
        if oi:
            data = serializers.serialize("json", [oi], ensure_ascii=False)
            data = data[1:-1]
            return JsonResponse({"data": data})
        else:
            #objeto ya no existe
            data = 'null'
            return JsonResponse({"data": data})

@login_required
def consultar_orden(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    #Si el rol del usuario no es cliente no puede entrar a la página
    if (user_logged.rol.nombre == "Soporte" or user_logged.rol.nombre == "Facturacion" or user_logged.rol.nombre == "SuperUser" or user_logged.rol.nombre=="Ventas"):
        data = {}
        vector_muestras = None
        user_serialize = None
        email = {}
        empresa = {}
        analisis_muestras = {}
        facturas_muestras = {}
        if request.method == 'POST':
            if not (request.POST.get('id')):
                raise Http404
            id = request.POST.get('id')
            #oi = orden interna
            oi = OrdenInterna.objects.get(idOI = id)
            if oi:
                solicitante = IFCUsuario.objects.get(user = oi.usuario.user)
                solicitante = serializers.serialize("json", [solicitante], ensure_ascii = False)
                solicitante = solicitante[1:-1]
                data = serializers.serialize("json", [oi], ensure_ascii = False)
                data = data[1:-1]
                muestras = Muestra.objects.filter(oi = oi)
                data_muestras= []
                if muestras:
                    for muestra in muestras:
                        data_muestras.append(muestra)
                    usuario = muestras[0].usuario
                    user_serialize = serializers.serialize("json", [usuario], ensure_ascii=False)
                    user_serialize = user_serialize[1:-1]
                    vector_muestras = serializers.serialize("json", data_muestras, ensure_ascii=False)
                    email = usuario.empresa.correo_resultados
                    empresa = usuario.empresa.empresa
                    telefono = usuario.empresa.telefono
                    analisis_muestras = {}
                    facturas_muestras = {}
                    for muestra in muestras:
                        #recuperas todos los analisis de una muestra
                        #ana_mue es objeto de tabla AnalisisMuestra
                        ana_mue = AnalisisMuestra.objects.filter(muestra = muestra)
                        analisis = []
                        if muestra.factura:
                            facturas_muestras[muestra.id_muestra] = muestra.factura.idFactura
                        else:
                            facturas_muestras[muestra.id_muestra] = "no hay"

                        for a in ana_mue:
                            analisis.append(a.analisis.codigo)
                        analisis_muestras[muestra.id_muestra] =  analisis
                    return JsonResponse(
                            {"data": data,
                            "muestras":vector_muestras,
                            "usuario":user_serialize,
                            "correo":email,
                            "empresa":empresa,
                            "telefono":telefono,
                            "dict_am":analisis_muestras,
                            "facturas":facturas_muestras,
                            "solicitante":solicitante}
                        )
                else:
                    response = JsonResponse({"error": "Hubo un error con las muestras"})
                    #response.status_code = 500
                    return response
            else:
                response = JsonResponse({"error": "No existe esa orden interna"})
                response.status_code = 500
                # Regresamos la respuesta de error interno del servidor
                return response
        else:
            response = JsonResponse({"error": "No se mandó por el método correcto"})
            response.status_code = 500
            # Regresamos la respuesta de error interno del servidor
            return response
    else:
        raise Http404

@login_required
def actualizar_muestra(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Soporte" or user_logged.rol.nombre=="Facturacion" or user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
        raise Http404
    if request.method == 'POST':
        muestra = Muestra.objects.filter(id_muestra = request.POST['id_muestra']).first()
        if muestra:
            #Actualizar campos
            muestra.num_interno_informe = request.POST['num_interno_informe']
            if isinstance(request.POST['factura'], int):
                factura = Factura.objects.filter(idFactura = request.POST['factura']).first()
                if factura:
                    muestra.factura = factura
                else:
                    muestra.factura = None
            muestra.orden_compra = request.POST['orden_compra']
            muestra.fechah_recibo = request.POST['fechah_recibo']
            muestra.save()
            # Cargar de nuevo la muestra
            muestra_actualizada = Muestra.objects.get(id_muestra = request.POST['id_muestra'])
            data = serializers.serialize("json", [muestra_actualizada], ensure_ascii = False)
            data = data[1:-1]
            # Regresamos información actualizada
            return JsonResponse({"data": data})


@login_required
def actualizar_orden(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Soporte" or user_logged.rol.nombre=="Facturacion" or user_logged.rol.nombre=="Ventas" or user_logged.rol.nombre=="SuperUser"):   #Si el rol del usuario no es cliente no puede entrar a la página
        raise Http404
    if request.method == 'POST':
        oi = OrdenInterna.objects.get(idOI = request.POST['idOI'])
        if oi:
            #Actualizar campos
            oi.estatus = request.POST['estatus']

            oi.localidad = request.POST['localidad']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_envio'] == "":
                oi.fecha_envio = None
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_envio = request.POST['fecha_envio']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_recepcion_m'] == "":
                oi.fecha_recepcion_m = None
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_recepcion_m = request.POST['fecha_recepcion_m']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_llegada_lab'] == "":
                oi.fecha_llegada_lab = None
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_llegada_lab = request.POST['fecha_llegada_lab']

            oi.guia_envio = request.POST['guia_envio']
            oi.link_resultados = request.POST['link_resultados']
            oi.idioma_reporte = request.POST['idioma_reporte']
            oi.observaciones = request.POST['observaciones']
            oi.pagado = request.POST['pagado']
            oi.usuario = user_logged
            #Guardar
            oi.save()

            # Cargar de nuevo la orden interna
            oi_actualizada = OrdenInterna.objects.get(idOI = request.POST['idOI'])
            data = serializers.serialize("json", [oi_actualizada], ensure_ascii = False)
            data = data[1:-1]
            # try:
            #     locale.setlocale(locale.LC_TIME, 'es_co.utf8') #your language encoding
            # except:
            #     locale.setlocale(locale.LC_TIME, 'es_co')
            try:
                fecha_formato = oi_actualizada.fecha_envio.strftime("%d/%b/%Y")
            except:
                fecha_formato = "Ninguna"
            # Regresamos información actualizada
            return JsonResponse(
                {"data": data,
                "fecha_formato": fecha_formato}
                )


def validacion_dhl(codigo):
    #Validación del codigo de paquete de DHL en API

    url = "https://api-eu.dhl.com/track/shipments"

    headers = {
        'Accept': 'application/json',
        'DHL-API-Key': 'dGmqZ7RmVGHGkLWYR8y28C7qMsDtiMmn'
        }
    payload = {
        'trackingNumber': "'"+ codigo + "'",
        #8426939231
        #5551260643
        'service': 'express'
    }

    resp = requests.get(url, params=payload, headers=headers) #Manda informacion de paquete y obtiene response de API


    return resp.status_code


def codigo_repetido(codigo_DHL):
    #Checa si el codigo de DHL ya existe

    try:
        cod_test = Paquete.objects.get(codigo_dhl = codigoDHL)
    except:
        cod_test = None

    if(cod_test == None):
        return False

    return True



def guardar_paquete(codigo_DHL, ids_OrdI):
    #Guarda codigo en BD y relaciona a O.I


    if len(ids_OrdI) == 0: #Verifica que haya algo en lista de O.I
        return 204

    if not codigo_repetido(codigo_DHL): #Verifica si el codigo no existe
        codigo = Paquete(codigo_dhl=codigo_DHL)  #Introduce nuevo codigo a BD
        codigo.save()

    for id in ids_OrdI: #Asignar codigo DHL
        try:
            referencia = Muestra.objects.get(id_muestra = id) #Obtener objeto de O.I
        except:
            referencia = None

        if(referencia != None): #Valida si existe la O.I
            cod_dhl = Paquete.objects.filter(codigo_dhl = codigo_DHL).first()
            referencia.paquete_id = cod_dhl.id_paquete  #Asigna codigo
            referencia.save()
        else:
            return False

    return True


def validacion_codigo(request):
    user_logged = IFCUsuario.objects.get(user = request.user)   #Obtener el usuario logeado
    if not (user_logged.rol.nombre=="Soporte" or user_logged.rol.nombre=="SuperUser" or user_logged.rol.nombre=="Ventas"):   #Si el rol del usuario no es cliente no puede entrar a la página
        raise Http404
    #Obtención de codigo y verificación de Form

    if request.method == 'POST':
        form = codigoDHL(request.POST)
        if form.is_valid():

            codigo = form.cleaned_data['codigo_dhl']    #Obtiene datos de la form
            m_seleccionadas = request.POST.getlist('mselected')    #Obtiene datos de la form

            resp = validacion_dhl(codigo)   #Valida codigo ingresado en Form


            if(resp == 200):    #Guardar codigo si es valido
                if not guardar_paquete(codigo,m_seleccionadas):
                    resp = 404
                elif guardar_paquete(codigo,m_seleccionadas) == 204:
                    resp = 204
            else:
                resp = 404

            #Pasar una variable por url de exito o fallo
            baseurl = reverse('ordenes_internas')
            querystring = urlencode({'successcode': resp})
            url = '{}?{}'.format(baseurl, querystring)

            request.session['alerta'] = 1

            return redirect(url)

    else:
        form = codigoDHL()  #Se manda Form vacia
    return redirect('ordenes_internas')

@login_required
def muestra_enviar(request): #guia para guardar muestras
    if request.session._session:
        if request.method=='POST':
            if (request.POST.get('nombre')
                    and request.POST.get('direccion')
                    and request.POST.get('pais')
                    and request.POST.get('estado')
                    and request.POST.get('idioma')
                    and request.POST.get('producto')
                    and request.POST.get('variedad')
                    and request.POST.get('parcela')
                    and request.POST.get('pais_destino')
                    and request.POST.get('clave_muestra')
                    and request.POST.get('enviar')
                    and request.POST.get('fecha_muestreo')
            ): #verificar que toda la información necesaria se envíe por POST
                user_logged = IFCUsuario.objects.get(user=request.user) #obtener usuario que inició sesión
                if not (user_logged.rol.nombre == "Cliente" or user_logged.rol.nombre == "SuperUser"): #verificar que el usuario pertenezca al grupo  permisos
                    raise Http404
                all_analysis_cot = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,
                                                                       cotizacion__usuario_c=user_logged) #obtener todos los análisis disponibles en las cotizaciones
                #phantom_user = IFCUsuario.objects.get(apellido_paterno="Phantom",apellido_materno="Phantom")#obtener usuario fantasma (dummy) para crear las ordenes internas
                muestras_hoy=Muestra.objects.filter(usuario=user_logged).filter(fecha_forma=datetime.datetime.now().date()) #verificar si se ha registrado una muestra en el día
                if muestras_hoy:
                    oi = muestras_hoy[0].oi #si se ha registrado una muestra en el mismo día, usar la misma orden interna
                    for m in muestras_hoy:
                        if m.oi.estatus != 'Borrado':
                            if m.usuario == user_logged:
                                oi = m.oi
                    if oi.estatus == 'Borrado':
                        oi = OrdenInterna()
                        oi.usuario = user_logged #phantom_user
                        if request.POST.get('enviar') == "1": #verificar si se envió información para guardar o para enviar
                            oi.estatus = 'Fantasma'
                        else:
                            oi.estatus = 'Invisible'
                        oi.idioma_reporte = request.POST.get('idioma')
                        oi.save()
                else: #crear orden interna si no se ha registrado una
                    oi = OrdenInterna()
                    oi.usuario = user_logged #phantom_user
                    if request.POST.get('enviar') == "1": #verificar si se envió información para guardar o para enviar
                        oi.estatus = 'Fantasma'
                    else:
                        oi.estatus = 'Invisible'
                    oi.idioma_reporte = request.POST.get('idioma')
                    oi.save()
                muestra = Muestra() #crear muestra a guardar
                muestra.usuario = IFCUsuario.objects.get(user = request.user)
                muestra.oi = oi
                muestra.producto = request.POST.get('producto')
                muestra.variedad = request.POST.get('variedad')
                muestra.pais_origen = request.POST.get('pais')
                muestra.codigo_muestra = request.POST.get('clave_muestra')
                muestra.agricultor = request.POST.get('nombre')
                muestra.ubicacion = request.POST.get('direccion')
                muestra.estado = request.POST.get('estado')
                muestra.parcela = request.POST.get('parcela')
                muestra.fecha_muestreo = request.POST.get('fecha_muestreo')
                muestra.destino = request.POST.get('pais_destino')
                muestra.idioma = request.POST.get('idioma')
                if request.POST.get('enviar')=="1": #verificar si se envió información para guardar o para enviar
                    muestra.estado_muestra = True
                else:
                    muestra.estado_muestra = False
                muestra.fecha_forma = datetime.datetime.now().date()
                muestra.save()
                #guardar en tabla analisis_muestra
                prefix = "analisis"
                for key,value in request.POST.items(): #iterar para toda la información enviada para buscar análisis
                    if key.startswith(prefix): #buscar todos los campos relacionados con análisis (todos los campos que empiezan con análisis)
                        if request.POST.get(key,'') == 'on': #verificar que se ha seleccionado el análisis
                            id_analisis = int(key[len(prefix):]) #obtener id del análisis
                            analisis = Analisis.objects.get(id_analisis=id_analisis) #obtener análisis a partir del id
                            am = AnalisisMuestra() #crear una nueva entrada en la tabla análisis muestra
                            am.analisis = analisis
                            am.muestra = muestra
                            am.fecha = datetime.datetime.now()
                            if request.POST.get('enviar')=="1": #verificar que la información se haya enviado para guardar o enviar
                                am.estado = True
                                a = all_analysis_cot.filter(analisis__id_analisis=id_analisis).first()
                                a.cantidad = a.cantidad-1 #disminuir cantidad de análisis disponibles
                                a.save()
                            else:
                                am.estado = False
                            am.save()
                if request.POST.get('otro'): #verificar si se seleccionó la opción otro análisis
                    am=AnalisisMuestra() #crear nueva entrada con el tipo de análisis otro
                    am.analisis=Analisis.objects.get(nombre='Otro')
                    am.muestra=muestra
                    am.fecha = datetime.datetime.now()
                    if request.POST.get('enviar') == "1": #verificar que la información se haya enviado para guardar o enviar
                        am.estado = True
                    else:
                        am.estado = False
                    am.save()
                return HttpResponseRedirect("ingreso_cliente") #redireccionar para volver a ingresar muestra
            else:
                raise Http404
        else:
            raise Http404
    else:
        raise Http404


###############  CONTROLADOR USVP09-24 ##################

def borrar_orden_interna(request):
    user_logged = IFCUsuario.objects.get(user = request.user) # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Soporte" or user_logged.rol.nombre == "SuperUser" or user_logged.rol.nombre=="Ventas":
        if request.method == 'POST':
            id = request.POST.get('id')
            oi = OrdenInterna.objects.get(idOI = id)
            if oi:
                oi.estatus = 'Borrado'
                oi.save()
                return HttpResponse('OK')
            else:
                response = JsonResponse({"error": "No existe la Orden Interna"})
                response.status_code = 500
                return response
        else:
            response = JsonResponse({"Error": "No se mandó la petición por el método correcto"})
            response.status_code = 500
            return response
    else:
        raise Http404

############### USVP09-24 ##################


############### UST04-34 ##################
@login_required
def consultar_empresa_muestras(request): #devuelve la empresa de un usurio a partir de una orden interna
    user_logged = IFCUsuario.objects.get(user=request.user)  # Obtener el usuario logeado
    # Si el rol del usuario no es servicio al cliente, director o superusuario, el acceso es denegado
    if not (user_logged.rol.nombre == "Soporte"
            or user_logged.rol.nombre == "Director"
            or user_logged.rol.nombre == "SuperUser"
    ):
        raise Http404
    if request.method != 'POST':  # Si no se envía un post, el acceso es denegado
        raise Http404
    if not request.POST.get('id'):  # Si no se envía el campo requerido, el acceso es denegado
        raise Http404
    id = request.POST.get('id')
    oi = OrdenInterna.objects.get(idOI=id)
    muestras = Muestra.objects.filter(oi=oi)  # Se obtienen todas las muestras de una orden interna
    empresa = None
    data_muestras = []
    if muestras:  # A partir de una muestra, se obtiene la información del usuario y de su empresa
        empresa = muestras.first().usuario.empresa
        for muestra in muestras:
            data_muestras.append(muestra)
    vector_muestras = serializers.serialize("json", data_muestras, ensure_ascii=False)
    data = serializers.serialize("json", [empresa], ensure_ascii = False) #El objeto de tipo empresa se encapsula en un formato JSON
    return JsonResponse({"data": data,"muestras":vector_muestras})  # Se envía el JSON con la empresa

@login_required
def enviar_archivo(request): #envía un archivo de resultados por correo
    if request.method != 'POST': #Si no se envía un post, el acceso es denegado
        raise Http404
    user_logged = IFCUsuario.objects.get(user = request.user)  # Obtener el usuario logeado
    #Si el rol del usuario no es servicio al cliente, director o superusuario, el acceso es denegado
    if not (user_logged.rol.nombre == "Soporte"
                or user_logged.rol.nombre == "Director"
                or user_logged.rol.nombre == "SuperUser"
        ):
        raise Http404
    mail_code = 0
    if request.method == 'POST':
        form = EnviarResultadosForm(request.POST, request.FILES)
        if form.is_valid():
            mail_code = handle_upload_document(request.FILES['archivo_resultados'],
                                        request.POST.get('email_destino'),
                                        request.POST.get('subject'),
                                        request.POST.get('body'),
                                        request.POST.get('muestra'),
                                   )
        else:
            raise Http404
    if mail_code == 202: #Si el código es 202, el mail fue enviado correctamente y se muestra el mensaje de éxito
        request.session['success_sent'] = 1
    else:
        request.session['success_sent'] = -1
    return redirect('/reportes/ordenes_internas')

def handle_upload_document(file,dest,subject,body,muestra): #Esta función guarda el archivo de resultados a enviar
    path = './archivos-reportes/resultados'
    path += str(datetime.date.today())
    path += str(int(random.uniform(1,100000))) #Se escribe un nombre de archivo único con la fecha y un número aleatorio
    muestras = Muestra.objects.filter(id_muestra=muestra)
    if muestras:
        muestra_object = muestras.first()
        muestra_object.link_resultados = path
        muestra_object.save()
    else:
        return 404
    with open(path, 'wb+') as destination: #Se escribe el archivo en el sistema
        for chunk in file.chunks():
            destination.write(chunk)
    return send_mail(path,dest,subject,body)

def send_mail(path,dest,subject,body): #Esta función utiliza la API sendgrid para enviar el correo
    message = Mail(
        from_email = 'A0127373@itesm.mx',
        to_emails = dest,
        subject = subject,
        html_content = body) #Se fijan los parametros del correo
    pdf_path = path
    with open(pdf_path, 'rb') as file: #Se obtiene el archivo a enviar
        data = file.read()
    encoded = base64.b64encode(data).decode() #Se codifica el contenido del archivo
    attachment = Attachment() #Se agregan los parámetros del archivo a enviar
    attachment.file_content = FileContent(encoded)
    attachment.file_type = FileType('application/pdf')
    attachment.file_name = FileName('Results.pdf')
    attachment.disposition = Disposition('attachment')
    attachment.content_id = ContentId('Example Content ID')
    message.attachment = attachment
    try:
        with open('./API_KEY.txt','rb') as file: #Se obtiene la llave del API para autenticar
            key = file.read()
        key_decoded = key.decode('ascii')
        sendgrid_client = SendGridAPIClient(key_decoded) #Se envía el correo
        response = sendgrid_client.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)
        return response.status_code #Se regresa el código de la API
    except Exception as e:
        print(e.message)

def visualizar_facturacion(request):
    if request.method == 'POST':

        id_oi = request.POST.get('id')
        oi_requested = OrdenInterna.objects.filter(idOI=id_oi).first()
        data = []
        consulta_factura = FacturaOI.objects.filter(oi=oi_requested) # Validar si ya existe un registro de facturacion para la OI

        if not consulta_factura:
            new_factura_oi = FacturaOI(oi=oi_requested)
            new_factura_oi.save()
        else:
            new_factura_oi = consulta_factura.first()

        factura_oi_s = serializers.serialize("json", [new_factura_oi], ensure_ascii = False)
        data.append(factura_oi_s)

        # Consultar todas las cotizaciones relacionadas a la OI
        analisis_muestra = AnalisisMuestra.objects.filter(id_oi=oi_requested)
        for am in analisis_muestra:
            arr_analisis_s = serializers.serialize("json", [am.id_analisis_cotizacion.analisis], ensure_ascii = False)
            data.append(arr_analisis_s)
            arr_id_ac_s = serializers.serialize("json", [am.id_analisis_cotizacion], ensure_ascii = False)
            data.append(arr_id_ac_s)
            arr_muestra_s = serializers.serialize("json", [am.muestra], ensure_ascii = False)
            data.append(arr_muestra_s)



        #response = serializers.serialize("json", data,  cls=LazyEncoder)
        print(data)
        return JsonResponse({"data": data })
    else:
        raise Http404


@login_required
def editar_facturacion(request):
    user_logged = IFCUsuario.objects.get(user = request.user)  # Obtener el tipo de usuario logeado
    if user_logged.rol.nombre == "Facturacion" or user_logged.rol.nombre == "SuperUser": # Validar roles de usuario logeado
        if request.method == 'POST':    # Verificar que solo se puede acceder mediante un POST
            form = EditarFactura(request.POST)
            if form.is_valid():         # Verificar si los datos de la forma son validos
               # Tomar los datos por su nombre en el HTML
                n_resp_pago = form.cleaned_data['resp_pago']
                n_correos = form.cleaned_data['correos']
                n_numero_factura = form.cleaned_data['numero_factura']
                n_complemento_pago = form.cleaned_data['complemento_pago']
                n_pago_factura = form.cleaned_data['pago_factura']
                n_orden_compra = form.cleaned_data['orden_compra']
                n_fecha_factura = form.cleaned_data['fecha_factura']
                n_fecha_envio_factura = form.cleaned_data['fecha_factura']
                n_envio_factura = request.POST['envio_factura']
                n_cobrar_envio = request.POST['cobrar_envio']
                n_envio_informes = request.POST['envio_informes']

                n_oi = OrdenInterna.objects.get(idOI=n_pais)
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
