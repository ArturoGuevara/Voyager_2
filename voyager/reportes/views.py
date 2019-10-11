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


def indexView(request):
    return render(request, 'reportes/index.html')

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
        
