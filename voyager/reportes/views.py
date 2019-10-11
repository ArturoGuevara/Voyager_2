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