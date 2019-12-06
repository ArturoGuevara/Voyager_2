from django.shortcuts import render
from django.http import Http404
from django.views import generic
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect


@login_required
def indexView(request):
     return redirect('/cuentas/home')

def godaddy(request):
    return render(request, 'root/godaddy.html')
