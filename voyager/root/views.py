from django.shortcuts import get_object_or_404, render

def indexView(request):
    return render(request, 'root/base.html')