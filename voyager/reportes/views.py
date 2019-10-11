from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna, Paquete
from .forms import OrdenInternaF,codigoDHL
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.shortcuts import redirect
from django.urls import reverse
from urllib.parse import urlencode
import requests
import json
from .models import AnalisisCotizacion,Cotizacion,AnalisisMuestra,Muestra,Analisis
from cuentas.models import IFCUsuario
from django.http import Http404
import datetime
from django.contrib.auth.decorators import login_required


# Create your views here.
@login_required
def ingreso_cliente(request):
    return render(request, 'reportes/ingreso_cliente.html')

@login_required
def ingresar_muestras(request):
    if (request.session._session
            and request.POST.get('nombre')
            and request.POST.get('direccion')
            and request.POST.get('pais')
            and request.POST.get('estado')
            and request.POST.get('idioma')
    ):
        user_logged = IFCUsuario.objects.get(user = request.user)
        all_analysis = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,cotizacion__usuario_c=user_logged)
        return  render(request, 'reportes/ingresar_muestra.html',{'all_analysis': all_analysis,
                                                                  'nombre': request.POST.get('nombre'),
                                                                  'direccion': request.POST.get('direccion'),
                                                                  'pais': request.POST.get('pais'),
                                                                  'estado': request.POST.get('estado'),
                                                                  'idioma': request.POST.get('idioma'),})
    else:
        raise Http404

@login_required
def indexView(request):
    return render(request, 'reportes/index.html')


@login_required
def ordenes_internas(request):
    
    estatus_OI_paquetes = "activo"  #Estatus a buscar de OI para crear paquete

    ordenes = OrdenInterna.objects.all()
    ordenes_activas = OrdenInterna.objects.filter(estatus=estatus_OI_paquetes).order_by('idOI')
    form = codigoDHL()

    
    response = request.GET.get('successcode') #Recibe codigo de validacion_codigo view
    

    context = {
        'ordenes': ordenes,
        'ordenes_activas': ordenes_activas,
        'form': form,
        'successcode': response,
    }
    
    return render(request, 'reportes/ordenes_internas.html', context)


@login_required
def oi_guardar(request, form, template_name):
    data = dict()
    if request.method == 'POST':
        if form.is_valid():
            form.save()
            data['form_is_valid'] = True
            ordenes = OrdenInterna.objects.all()
            context = {
                'ordenes': ordenes,
            }
            data['html_oi_list'] = render_to_string('reportes/modals/oi_lista.html', context)
        else:
            data['form_is_valid'] = False
    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)


@login_required
def oi_actualizar(request, pk):
    oi = get_object_or_404(OrdenInterna, pk=pk)
    if request.method == 'POST':
        form = OrdenInternaF(request.POST, instance=oi)
    else:
        form = OrdenInterna(instance=oi)
    return oi_guardar(request, form, 'reportes/modals/oi_actualizar.html')



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
            referencia = OrdenInterna.objects.get(idOI = id) #Obtener objeto de O.I
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
    #Obtención de codigo y verificación de Form

    if request.method == 'POST':
        form = codigoDHL(request.POST)
        if form.is_valid():
            
            codigo = form.cleaned_data['codigo_dhl']    #Obtiene datos de la form
            oi_seleccionadas = request.POST.getlist('oiselected')    #Obtiene datos de la form
            
            resp = validacion_dhl(codigo)   #Valida codigo ingresado en Form
            
            
            if(resp == 200):    #Guardar codigo si es valido
                if not guardar_paquete(codigo,oi_seleccionadas):
                    resp = 404
                elif guardar_paquete(codigo,oi_seleccionadas) == 204:
                    resp = 204
            else:
                resp = 404    

            #Pasar una variable por url de exito o fallo
            baseurl = reverse('ordenes_internas')
            querystring = urlencode({'successcode': resp})
            url = '{}?{}'.format(baseurl, querystring)

            return redirect(url)
    
    else:
        form = codigoDHL()  #Se manda Form vacia

    return redirect('ordenes_internas')
        
@login_required
def muestra_enviar(request):
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
            ):
                user_logged = IFCUsuario.objects.get(user=request.user)
                all_analysis_cot = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,
                                                                       cotizacion__usuario_c=user_logged)
                #obtener usuario fantasma
                phantom_user = IFCUsuario.objects.get(id=2)
                muestras_hoy=Muestra.objects.filter(fecha=datetime.now().date())
                #guardar orden interna
                if muestras_hoy:
                    oi = muestras_hoy[0].oi
                else:
                    oi = OrdenInterna()
                    oi.usuario = phantom_user
                    if request.POST.get('enviar') == 1:
                        oi.estatus = 'fantasma'
                    else:
                        oi.estatus = 'invisible'
                    oi.idioma_reporte = request.POST.get('idioma')
                    oi.save()
                #guardar muestra
                muestra = Muestra()
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
                if request.POST.get('enviar')==1:
                    muestra.estado_muestra = True
                else:
                    muestra.estado_muestra = False
                #guardar en tabla analisis_muestra
                prefix = "analisis"
                for key,value in request.POST.items():
                    if key.startswith(prefix):
                        if request.POST.get(key,'') == 'on':
                            id_analisis = int(key[len(prefix):])
                            analisis = Analisis.objects.get(id_analisis=id_analisis)
                            am = AnalisisMuestra()
                            am.analisis = analisis
                            am.muestra = muestra
                            am.fecha = datetime.datetime.now()
                            if request.POST.get('enviar')==1:
                                am.estado = True
                                a = all_analysis_cot.get(analisis__id_analisis=id_analisis)
                                a.cantidad = a.cantidad-1
                                a.save()
                            else:
                                am.estado = False
                            am.save()
            else:
                raise Http404
        else:
            raise Http404
    else:
        raise Http404
