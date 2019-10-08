from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna
from .forms import

# Create your views here.
def indexView(request):
    return render(request, 'procesamiento_reportes/index.html')

def ordenes_internas(request):
    ordenes = OrdenInterna.objects.all()
    context = {
        'ordenes': ordenes,
    }
    return render(request, 'procesamiento_reportes/ordenes_internas.html', context)



def oi_actualizar(request, pk):
    oi = get_object_or_404(OrdenInterna, pk=pk)
    if request.method == 'POST':
        form = OrdenInterna(request.POST, instance=oi)
    else:
        form = OrdenInterna(instance=oi)
    return oi_guardar(request, form, 'RUTA_PARCIAL_ACTUALIZACION')
