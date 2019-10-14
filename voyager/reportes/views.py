from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views import generic
from django.core import serializers
from .models import OrdenInterna

# Create your views here.
def ingreso_cliente(request):
    return render(request, 'reportes/ingreso_cliente.html')

def ingresar_muestras(request):
    return  render(request, 'reportes/ingresar_muestra.html')

def indexView(request):
    return render(request, 'reportes/index.html')

def ordenes_internas(request):
    ordenes = OrdenInterna.objects.all()
    context = {
        'ordenes': ordenes,
    }
    return render(request, 'reportes/ordenes_internas.html', context)

def busqueda(request, id):
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


def consultar_orden(request, id):
    if request.method == 'POST':
        oi = OrdenInterna.objects.get(idOI=id)
        if oi:
            data = serializers.serialize("json", [oi], ensure_ascii=False)
            data = data[1:-1]
            return JsonResponse({"data": data})

def actualizar_orden(request):
    if request.method == 'POST':
        oi = OrdenInterna.objects.get(idOI = request.POST['idOI'])
        if oi:
            #Actualizar campos
            oi.estatus = request.POST['estatus']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_muestreo'] == "":
                oi.fecha_muestreo = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_muestreo = request.POST['fecha_muestreo']

            oi.localidad = request.POST['localidad']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_envio'] == "":
                oi.fecha_envio = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_envio = request.POST['fecha_envio']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fechah_recibo'] == "":
                oi.fechah_recibo = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fechah_recibo = request.POST['fechah_recibo']

            oi.guia_envio = request.POST['guia_envio']
            oi.link_resultados = request.POST['link_resultados']
            oi.formato_ingreso_muestra = request.POST['formato_ingreso_muestra']
            oi.idioma_reporte = request.POST['idioma_reporte']
            oi.mrl = request.POST['mrl']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_eri'] == "":
                oi.fecha_eri = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_eri = request.POST['fecha_eri']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_lab'] == "":
                oi.fecha_lab = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_lab = request.POST['fecha_lab']


            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_ei'] == "":
                oi.fecha_ei = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_ei = request.POST['fecha_ei']

            oi.notif_e = request.POST['notif_e']
            oi.envio_ti = request.POST['envio_ti']
            oi.cliente_cr = request.POST['cliente_cr']
            #Guardar
            oi.save()
            
            # Cargar de nuevo la orden interna
            oi_actualizada = OrdenInterna.objects.get(idOI = request.POST['idOI'])
            data = serializers.serialize("json", [oi_actualizada], ensure_ascii = False)
            data = data[1:-1]
            # Regresamos información actualizada
            return JsonResponse({"data": data})

