from django.shortcuts import render

# Create your views here.
def ver_catalogo(request):
    return render(request, 'ventas/catalogo.html')