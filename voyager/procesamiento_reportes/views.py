from django.shortcuts import render

# Create your views here.
def ingreso_cliente(request):
    return render(request, 'procesamiento_reportes/ingreso_cliente.html')

def ingresar_muestras(request):
    return  render(request, 'procesamiento_reportes/ingresar_muestra.html')
