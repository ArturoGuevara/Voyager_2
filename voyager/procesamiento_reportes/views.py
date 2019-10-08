from django.shortcuts import get_object_or_404
from django.shortcuts import render
from procesamiento_reportes.models import OrdenInterna
from django.template.loader import render_to_string
from django.http import JsonResponse
from .forms import *


# Create your views here.
def indexView(request):
    return render(request, 'procesamiento_reportes/index.html')

def ordenes_internas(request):
    ordenes = OrdenInterna.objects.all()
    context = {
        'ordenes': ordenes,
    }
    return render(request, 'procesamiento_reportes/ordenes_internas.html', context)



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

