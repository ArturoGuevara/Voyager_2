from django.shortcuts import render

# Create your views here.
def indexView(request):
    return render(request, 'procesamiento_reportes/index.html')

def ingresar_muestra(request):
    return  render(request, 'procesamiento_reportes/ingresar_muestra.html')
