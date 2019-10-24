from django.shortcuts import get_object_or_404, render
from django.contrib.auth.decorators import login_required

@login_required
def indexView(request):
    return render(request, 'root/base.html')
