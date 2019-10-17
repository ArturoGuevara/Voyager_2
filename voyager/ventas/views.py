from django.shortcuts import render
from reportes.models import Analisis, Cotizacion
from cuentas.models import IFCUsuario
from django.http import JsonResponse
from django.core import serializers
from django.http import HttpResponse
from django.urls import reverse_lazy
from django.views import generic
from django.contrib.auth.decorators import login_required
from django.http import Http404

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
        else:
            response = JsonResponse({"error": "No existe ese análisis"})
            response.status_code = 500
            # Regresamos la respuesta de error interno del servidor
            return response
    else:
        response = JsonResponse({"error": "No se mandó por el método correcto"})
        response.status_code = 500
        # Regresamos la respuesta de error interno del servidor
        return response
    
@login_required
def editar_analisis(request, id):
    # Checamos que el método sea POST
    if request.method == 'POST':
        # Obtenemos el objeto de análisis
        analisis = Analisis.objects.get(id_analisis = id)
        if analisis:
            #Que ningún campo esté vacío
            if is_not_empty(request.POST['nombre']) and is_not_empty(request.POST['codigo']) and is_not_empty(request.POST['descripcion']) and is_not_empty(request.POST['precio']) and is_not_empty(request.POST['tiempo']):
                # Actualizamos campos
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
            else:
                response = JsonResponse({"error": "Campos vacíos"})
                response.status_code = 500
                # Regresamos la respuesta de error interno del servidor
                return response
        else:
            response = JsonResponse({"error": "No existe ese análisis"})
            response.status_code = 500
            # Regresamos la respuesta de error interno del servidor
            return response
    else:
        response = JsonResponse({"error": "No se mandó por el método correcto"})
        response.status_code = 500
        # Regresamos la respuesta de error interno del servidor
        return response

@login_required
def borrar_analisis(request, id):
    # Checamos que el método sea POST
    if request.method == 'POST':
        # Obtenemos el objeto de análisis
        analisis = Analisis.objects.get(id_analisis = id)
        if analisis:
            analisis.delete()
            return HttpResponse('OK')
        else:
            response = JsonResponse({"error": "No existe ese análisis"})
            response.status_code = 500
            # Regresamos la respuesta de error interno del servidor
            return response
    else:
        response = JsonResponse({"error": "No se mandó por el método correcto"})
        response.status_code = 500
        # Regresamos la respuesta de error interno del servidor
        return response

# Funciones para validar campos
def is_not_empty(data):
    if data != "":
        return True
    else:
        return False


@login_required
def ver_cotizaciones(request):
    if request.session._session:
        user_logged = IFCUsuario.objects.filter(user=request.user).first() #Obtener usuario que inició sesión
        if not user_logged.rol.nombre == "Cliente": #Verificar que el rol sea válido
            raise Http404
        cotizaciones = Cotizacion.objects.filter(usuario_c=user_logged)
        context = {
            'cotizaciones': cotizaciones,
        }
    return render(request, 'ventas/cotizaciones.html', context)
