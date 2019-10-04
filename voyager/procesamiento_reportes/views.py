from django.shortcuts import render

# Create your views here.
def indexView(request):
    return render(request, 'procesamiento_reportes/index.html')
