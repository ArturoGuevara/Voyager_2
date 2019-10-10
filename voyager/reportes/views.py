from django.shortcuts import render, get_object_or_404
from .models import OrdenInterna
from .forms import OrdenInternaF
from django.template.loader import render_to_string
from django.http import JsonResponse
from .models import AnalisisCotizacion,Cotizacion
from cuentas.models import IFCUsuario
from django.http import Http404

# Create your views here.
def ingreso_cliente(request):
    return render(request, 'reportes/ingreso_cliente.html')

def ingresar_muestras(request):
    if (request.session._session
            and request.POST.get('nombre')
            and request.POST.get('direccion')
            #and request.POST.get('pais')
            #and request.POST.get('estado')
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
                    and request.POST.get('pais_destino')
                    and request.POST.get('clave_muestra')
                    and request.POST.get('enviar')
            ):
                #obtener usuario fantasma
                phantom_user = IFCUsuario.objects.get(id=2)
                # guardar orden interna
                oi = OrdenInterna()
                oi.usuario = phantom_user
                if request.POST.get('enviar')==1:
                    oi.estatus = 'fantasma'
                    #disminuir cantidad de analisis
                else:
                    oi.estatus = 'invisible'
                oi.idioma_reporte = request.POST.get('idioma')
                oi.save()
                #guardar en tabla analisis_muestra
                #guardar muestra
            else:
                raise Http404
        else:
            raise Http404
    else:
        raise Http404
