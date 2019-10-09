from django.shortcuts import get_object_or_404
from django.shortcuts import render
from procesamiento_reportes.models import OrdenInterna
from django.template.loader import render_to_string
from django.http import JsonResponse
from .forms import infoForma, observacionesForma
from django.urls import reverse_lazy
from django.views import generic
from django.core import serializers
from .models import OrdenInterna
from bootstrap_modal_forms.generic import (BSModalCreateView,
                                           BSModalUpdateView,
                                           BSModalReadView,
                                           BSModalDeleteView)



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
            ordenes_internas = OrdenInterna.objects.all()
            data['html_book_list'] = render_to_string('books/includes/partial_book_list.html', {
                'books': ordenes_internas
            })
        else:
            data['form_is_valid'] = False
    context = {'form': form}
    return JsonResponse(data)



class oi_info_actualizar2(BSModalUpdateView):
    model = OrdenInterna
    template_name = 'procesamiento_reportes/modals/actualizar_info_forma.html'
    form_class = infoForma
    success_message = 'Éxito! Orden Interna actualizada!'
    success_url = reverse_lazy('ordenes_internas')


def oi_info_actualizar(request, pk):
    oi = get_object_or_404(OrdenInterna, pk=pk)
    if request.method == 'POST':
        form = infoForma(request.POST, instance=oi)
    else:
        form = infoForma(instance=oi)
    return oi_guardar(request, form, 'books/includes/partial_book_update.html')





def oi_observaciones_actualizar(request, pk):
    oi = get_object_or_404(OrdenInterna, pk=pk)
    if request.method == 'POST':
        form = observacionesForma(request.POST, instance=oi)
    else:
        form = observacionesForma(instance=oi)
    return oi_guardar(request, form, 'books/includes/partial_book_update.html')

