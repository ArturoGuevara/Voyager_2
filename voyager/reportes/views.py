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


# Create your views here.
def indexView(request):
    return render(request, 'reportes/index.html')

def ordenes_internas(request):
    #Estatus a buscar de OI para crear paquete
    estatus_OI_paquetes = "activo"

    ordenes = OrdenInterna.objects.all()
    ordenes_activas = OrdenInterna.objects.filter(estatus=estatus_OI_paquetes).order_by('idOI')
    form = codigoDHL()

    #Recibe codigo de validacion_codigo view
    response = request.GET.get('successcode')
    print("Respuesta alert:" + str(response))

    context = {
        'ordenes': ordenes,
        'ordenes_activas': ordenes_activas,
        'form': form,
        'successcode': response,
    }
    
    return render(request, 'reportes/ordenes_internas.html', context)

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

def oi_actualizar(request, pk):
    oi = get_object_or_404(OrdenInterna, pk=pk)
    if request.method == 'POST':
        form = OrdenInternaF(request.POST, instance=oi)
    else:
        form = OrdenInterna(instance=oi)
    return oi_guardar(request, form, 'reportes/modals/oi_actualizar.html')


#Validación del codigo de paquete de DHL en API
def validacion_dhl(codigo):
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
     
    url = 'https://api-eu.dhl.com/track/shipments'
    resp = requests.get(url, params=payload, headers=headers)
    
    
    return resp.status_code


def codigo_repetido(codigoDHL):

    try:
        cod_test = Paquete.objects.get(codigo_dhl = codigoDHL)
    except:
        cod_test = None
    
    if(cod_test == None):
        return False

    return True


#Guarda codigo en BD y relaciona a O.I
def guardar_paquete(codigoDHL, idsOrdI):

    #Guardar codigo de DHL
    if(codigo_repetido(codigoDHL) == False):
        codigo = Paquete(codigo_dhl=codigoDHL)
        codigo.save()
    #Asignar codigo DHL   
    for id in idsOrdI:
        try:
            #Obtener objeto de O.I
            referencia = OrdenInterna.objects.get(idOI = id)
        except:
            referencia = None
            return False

        #Valida si existe la O.I    
        if(referencia != None):
            cod_dhl = Paquete.objects.filter(codigo_dhl = codigoDHL).first()
            #Asigna codigo
            referencia.paquete_id = cod_dhl.id_paquete
            referencia.save()

    return True

    

#Obtención de codigo y verificación de Form
def validacion_codigo(request):

    if request.method == 'POST':
        form = codigoDHL(request.POST)
        if form.is_valid():
            codigo = form.cleaned_data['codigo_dhl']
            oiseleccionadas = request.POST.getlist('oiselected')
            resp = validacion_dhl(codigo)
            print(str(resp))
            for i in oiseleccionadas:
                print("OIS:" + str(i))
            #Guardar codigo si es valido
            if(resp == 200):
                if(guardar_paquete(codigo,oiseleccionadas) == False):
                    resp = 404
            elif(resp != 200):
                resp = 404    
            #Pasar una variable por url de exito o fallo
            baseurl = reverse('ordenes_internas')
            querystring = urlencode({'successcode': resp})
            url = '{}?{}'.format(baseurl, querystring)

            return redirect(url)
    else:
        form = codigoDHL()

    return redirect('ordenes_internas')
        
