from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna
from .forms import OrdenInternaF
from django.template.loader import render_to_string
from django.http import JsonResponse
from .models import AnalisisCotizacion,Cotizacion,AnalisisMuestra,Muestra,Analisis
from cuentas.models import IFCUsuario
from django.http import Http404
import datetime
from django.http import HttpResponseRedirect
from django.http import HttpResponse


# Create your views here.
def ingreso_cliente(request):
    if request.session._session:
        return render(request, 'reportes/ingreso_cliente.html')
    else:
        raise Http404

def ingresar_muestras(request):
    if (request.session._session
            and request.POST.get('nombre')
            and request.POST.get('direccion')
            and request.POST.get('pais')
            and request.POST.get('idioma')
            and (request.POST.get('estado1') or (request.POST.get('estado2'))
)
    ):
        user_logged = IFCUsuario.objects.get(user = request.user)
        if not user_logged.rol.nombre=="Cliente":
            raise Http404
        if request.POST.get('pais')=="México":
            estado = request.POST.get('estado1')
        else:
            estado = request.POST.get('estado2')
        all_analysis = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,cotizacion__usuario_c=user_logged)
        return  render(request, 'reportes/ingresar_muestra.html',{'all_analysis': all_analysis,
                                                                  'nombre': request.POST.get('nombre'),
                                                                  'direccion': request.POST.get('direccion'),
                                                                  'pais': request.POST.get('pais'),
                                                                  'estado': estado,
                                                                  'idioma': request.POST.get('idioma'),
                                                                  })
    else:
        raise Http404

def indexView(request):
    return render(request, 'reportes/index.html')

def ordenes_internas(request):
    ordenes = OrdenInterna.objects.all()
    context = {
        'ordenes': ordenes,
    }
    return render(request, 'reportes/ordenes_internas.html', context)

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
            data['html_oi_list'] = render_to_string('reportes/modals/oi_lista.html', context)
        else:
            data['form_is_valid'] = False
    context = {'form': form}
    data['html_form'] = render_to_string(template_name, context, request=request)
    return JsonResponse(data)

def oi_actualizar(request, pk):
    oi = get_object_or_404(OrdenInterna, pk=pk)
    if request.method == 'POST':
        form = OrdenInternaF(request.POST, instance=oi)
    else:
        form = OrdenInterna(instance=oi)
    return oi_guardar(request, form, 'reportes/modals/oi_actualizar.html')

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
                if not user_logged.rol.nombre == "Cliente":
                    raise Http404
                all_analysis_cot = AnalisisCotizacion.objects.all().filter(cantidad__gte=1,
                                                                       cotizacion__usuario_c=user_logged)
                #obtener usuario fantasma
                phantom_user = IFCUsuario.objects.get(apellido_paterno="Phantom",apellido_materno="Phantom")
                muestras_hoy=Muestra.objects.filter(fecha_forma=datetime.datetime.now().date())
                #guardar orden interna
                if muestras_hoy:
                    oi = muestras_hoy[0].oi
                else:
                    oi = OrdenInterna()
                    oi.usuario = phantom_user
                    if request.POST.get('enviar') == "1":
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
                if request.POST.get('enviar')=="1":
                    muestra.estado_muestra = True
                else:
                    muestra.estado_muestra = False
                muestra.fecha_forma = datetime.datetime.now().date()
                muestra.save()
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
                            if request.POST.get('enviar')=="1":
                                am.estado = True
                                a = all_analysis_cot.get(analisis__id_analisis=id_analisis)
                                a.cantidad = a.cantidad-1
                                a.save()
                            else:
                                am.estado = False
                            am.save()
                if request.POST.get('otro'):
                    am=AnalisisMuestra()
                    am.analisis=Analisis.objects.get(nombre='Otro')
                    am.muestra=muestra
                    am.fecha = datetime.datetime.now()
                    if request.POST.get('enviar') == "1":
                        am.estado = True
                    else:
                        am.estado = False
                    am.save()
                return HttpResponseRedirect("ingreso_cliente")
            else:
                raise Http404
        else:
            raise Http404
    else:
        raise Http404
