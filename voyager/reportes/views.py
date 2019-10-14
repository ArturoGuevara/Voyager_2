from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna
from django.template.loader import render_to_string
from django.http import JsonResponse
from django.urls import reverse_lazy
from django.views import generic
from django.core import serializers
from .models import OrdenInterna
from .models import AnalisisCotizacion,Cotizacion,AnalisisMuestra,Muestra,Analisis
from cuentas.models import IFCUsuario
from django.http import Http404
import datetime
from django.contrib.auth.decorators import login_required

# Create your views here.
@login_required
def ingreso_cliente(request):
    return render(request, 'reportes/ingreso_cliente.html')

@login_required
def ingresar_muestras(request):
    if (request.session._session
            and request.POST.get('nombre')
            and request.POST.get('direccion')
            and request.POST.get('pais')
            and request.POST.get('estado')
            and request.POST.get('idioma')
    ):
        user_logged = IFCUsuario.objects.get(user = request.user)
        all_analysis = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,cotizacion__usuario_c=user_logged)
        return  render(request, 'reportes/ingresar_muestra.html',{'all_analysis': all_analysis,
                                                                  'nombre': request.POST.get('nombre'),
                                                                  'direccion': request.POST.get('direccion'),
                                                                  'pais': request.POST.get('pais'),
                                                                  'estado': request.POST.get('estado'),
                                                                  'idioma': request.POST.get('idioma'),})
    else:
        raise Http404

@login_required
def indexView(request):
    return render(request, 'reportes/index.html')


@login_required
def ordenes_internas(request):
    ordenes = OrdenInterna.objects.all()
    context = {
        'ordenes': ordenes,
    }
    return render(request, 'reportes/ordenes_internas.html', context)

@login_required
def oi_guardar(request, form, template_name):
    data = dict()
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

def actualizar_orden(request):
    if request.method == 'POST':
        oi = OrdenInterna.objects.get(idOI = request.POST['idOI'])
        if oi:
            #Actualizar campos
            oi.estatus = request.POST['estatus']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_muestreo'] == "":
                oi.fecha_muestreo = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_muestreo = request.POST['fecha_muestreo']

            oi.localidad = request.POST['localidad']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_envio'] == "":
                oi.fecha_envio = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_envio = request.POST['fecha_envio']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fechah_recibo'] == "":
                oi.fechah_recibo = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fechah_recibo = request.POST['fechah_recibo']

            oi.guia_envio = request.POST['guia_envio']
            oi.link_resultados = request.POST['link_resultados']
            oi.formato_ingreso_muestra = request.POST['formato_ingreso_muestra']
            oi.idioma_reporte = request.POST['idioma_reporte']
            oi.mrl = request.POST['mrl']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_eri'] == "":
                oi.fecha_eri = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_eri = request.POST['fecha_eri']

            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_lab'] == "":
                oi.fecha_lab = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_lab = request.POST['fecha_lab']


            #Para las fechas checar si están vacías o formato incorrecto
            if request.POST['fecha_ei'] == "":
                oi.fecha_ei = None    
            else: #falta checar formato incorrecto, se hace en front
                oi.fecha_ei = request.POST['fecha_ei']

            oi.notif_e = request.POST['notif_e']
            oi.envio_ti = request.POST['envio_ti']
            oi.cliente_cr = request.POST['cliente_cr']
            #Guardar
            oi.save()
            
            # Cargar de nuevo la orden interna
            oi_actualizada = OrdenInterna.objects.get(idOI = request.POST['idOI'])
            data = serializers.serialize("json", [oi_actualizada], ensure_ascii = False)
            data = data[1:-1]
            # Regresamos información actualizada
            return JsonResponse({"data": data})

@login_required
def muestra_enviar(request):
    if request.session._session:
        if request.method=='POST':
            if (request.POST.get('nombre')
                    and request.POST.get('direccion')
                    and request.POST.get('pais')
                    and request.POST.get('estado')
                    and request.POST.get('idioma')
                    and request.POST.get('producto')
                    and request.POST.get('variedad')
                    and request.POST.get('parcela')
                    and request.POST.get('pais_destino')
                    and request.POST.get('clave_muestra')
                    and request.POST.get('enviar')
                    and request.POST.get('fecha_muestreo')
            ):
                user_logged = IFCUsuario.objects.get(user=request.user)
                all_analysis_cot = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,
                                                                       cotizacion__usuario_c=user_logged)
                #obtener usuario fantasma
                phantom_user = IFCUsuario.objects.get(id=2)
                muestras_hoy=Muestra.objects.filter(fecha=datetime.now().date())
                #guardar orden interna
                if muestras_hoy:
                    oi = muestras_hoy[0].oi
                else:
                    oi = OrdenInterna()
                    oi.usuario = phantom_user
                    if request.POST.get('enviar') == 1:
                        oi.estatus = 'fantasma'
                    else:
                        oi.estatus = 'invisible'
                    oi.idioma_reporte = request.POST.get('idioma')
                    oi.save()
                #guardar muestra
                muestra = Muestra()
                muestra.usuario = IFCUsuario.objects.get(user = request.user)
                muestra.oi = oi
                muestra.producto = request.POST.get('producto')
                muestra.variedad = request.POST.get('variedad')
                muestra.pais_origen = request.POST.get('pais')
                muestra.codigo_muestra = request.POST.get('clave_muestra')
                muestra.agricultor = request.POST.get('nombre')
                muestra.ubicacion = request.POST.get('direccion')
                muestra.estado = request.POST.get('estado')
                muestra.parcela = request.POST.get('parcela')
                muestra.fecha_muestreo = request.POST.get('fecha_muestreo')
                muestra.destino = request.POST.get('pais_destino')
                muestra.idioma = request.POST.get('idioma')
                if request.POST.get('enviar')==1:
                    muestra.estado_muestra = True
                else:
                    muestra.estado_muestra = False
                #guardar en tabla analisis_muestra
                prefix = "analisis"
                for key,value in request.POST.items():
                    if key.startswith(prefix):
                        if request.POST.get(key,'') == 'on':
                            id_analisis = int(key[len(prefix):])
                            analisis = Analisis.objects.get(id_analisis=id_analisis)
                            am = AnalisisMuestra()
                            am.analisis = analisis
                            am.muestra = muestra
                            am.fecha = datetime.datetime.now()
                            if request.POST.get('enviar')==1:
                                am.estado = True
                                a = all_analysis_cot.get(analisis__id_analisis=id_analisis)
                                a.cantidad = a.cantidad-1
                                a.save()
                            else:
                                am.estado = False
                            am.save()
            else:
                raise Http404
        else:
            raise Http404
    else:
        raise Http404

