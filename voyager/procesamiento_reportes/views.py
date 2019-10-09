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
def indexView(request):
    return render(request, 'procesamiento_reportes/index.html')

def ordenes_internas(request):
    ordenes = OrdenInterna.objects.all()
    context = {
        'ordenes': ordenes,
    }
    return render(request, 'procesamiento_reportes/ordenes_internas.html', context)

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
            return render(request, 'procesamiento_reportes/modals/actualizar_info_forma.html', context)
            #return JsonResponse({"data": data})
        else:
            #objeto ya no existe
            data = 'null'
            #return JsonResponse({"data": data})



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
            data['html_oi_list'] = render_to_string('procesamiento_reportes/modals/oi_lista.html', context)
        else:
            data['form_is_valid'] = False
    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)