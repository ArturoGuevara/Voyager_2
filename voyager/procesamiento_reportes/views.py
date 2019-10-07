from django.shortcuts import render

# Create your views here.
def ingreso_cliente(request):
    return render(request, 'procesamiento_reportes/ingreso_cliente.html')
