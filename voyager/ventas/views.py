from django.shortcuts import render
from reportes.models import Analisis
from django.http import JsonResponse
from django.core import serializers
from django.urls import reverse_lazy
from django.views import generic

# Create your views here.
def ver_catalogo(request):
    analisis = Analisis.objects.all()
    context = {
        'analisis': analisis,
    }
    return render(request, 'ventas/catalogo.html', context)

def cargar_analisis(request, id):
    if request.method == 'POST':
        analisis = Analisis.objects.get(id_analisis = id)
        if analisis:
            data = serializers.serialize("json", [analisis], ensure_ascii = False)
            data = data[1:-1]
            return JsonResponse({"data": data})