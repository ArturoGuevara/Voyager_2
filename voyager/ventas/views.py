from django.shortcuts import render
from reportes.models import Analisis
from cuentas.models import IFCUsuario
from django.http import JsonResponse
from django.core import serializers
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def ver_catalogo(request):
    analisis = Analisis.objects.all()
    context = {
        'analisis': analisis,
    }
    return render(request, 'ventas/catalogo.html', context)


@login_required
def cargar_analisis(request, id):
    if request.method == 'POST':
        analisis = Analisis.objects.get(id_analisis = id)
        if analisis:
            data = serializers.serialize("json", [analisis], ensure_ascii = False)
            data = data[1:-1]
            return JsonResponse({"data": data})
    
@login_required
def editar_analisis(request, id):
    if request.method == 'POST':
        analisis = Analisis.objects.get(id_analisis = id)
        if analisis:
            # Actualiamos campos
            analisis.nombre = request.POST['nombre']
            analisis.codigo = request.POST['codigo']
            analisis.descripcion = request.POST['descripcion']
            analisis.precio = request.POST['precio']
            analisis.tiempo = request.POST['tiempo']
            # Guardamos cambios
            analisis.save()
            # Obtenemos los nuevos valores
            analisis_actualizado = Analisis.objects.get(id_analisis = id)
            data = serializers.serialize("json", [analisis_actualizado], ensure_ascii = False)
            data = data[1:-1]
            # Regresamos información actualizada
            return JsonResponse({"data": data})