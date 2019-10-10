from django.shortcuts import render
from reportes.models import Analisis

# Create your views here.
def ver_catalogo(request):
    analisis = Analisis.objects.all()
    context = {
        'analisis': analisis,
    }
    return render(request, 'ventas/catalogo.html', context)