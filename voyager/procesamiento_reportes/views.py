from django.shortcuts import render

# Create your views here.
def indexView(request):
    return render(request, 'procesamiento_reportes/index.html')

def ordenes_internas(request):
    return render(request, 'procesamiento_reportes/ordenes_internas.html')
