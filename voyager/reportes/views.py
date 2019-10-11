from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna
from .forms import OrdenInternaF
from django.template.loader import render_to_string
from django.http import JsonResponse
from .forms import infoForma, observacionesForma
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


def busqueda2(request, id):

    if request.method == 'POST':
        id = id
        oi = OrdenInterna.objects.get(idOI=id)
        if oi:
            data = serializers.serialize("json", [oi], ensure_ascii=False)
            data = data[1:-1]
            iform = infoForma(request.POST, instance= oi)
            oform = observacionesForma(request.POST, instance= oi)
            context = {
                'data': data,
                'iform': iform,
                'oform': oform,
                'oi': oi,
            }
            return render(request, 'reportes/modals/actualizar_info_forma.html', context)
        else:
            #objeto ya no existe
            data = 'null'
            return render(request, 'reportes/modals/actualizar_info_forma.html', data)
            #return JsonResponse({"data": data})
