from django.shortcuts import render
import requests
import json
from django.contrib.auth.decorators import login_required
from cuentas.models import IFCUsuario
# Create your views here.
@login_required
def index(request):
    ifc_user = IFCUsuario.objects.get(user = request.user) # Esto es para mostrar el nombre de usuario en navbar
    url = "https://api-eu.dhl.com/track/shipments"

    headers = {
        'Accept': 'application/json',
        'DHL-API-Key': 'dGmqZ7RmVGHGkLWYR8y28C7qMsDtiMmn'
        }
    payload = {
        'trackingNumber': '5551260643',
        #8426939231
        #5551260643
        'service': 'express'
    }
    # This url is for testing
    url = 'https://api-eu.dhl.com/track/shipments'
    resp = requests.get(url, params=payload, headers=headers)

    data = json.loads(resp.text)

    context = {
        'user': ifc_user,
        'last_location' : data['shipments'][0]['events'][0]['location']['address']['addressLocality'],
        'description' : data['shipments'][0]['events'][0]['description'],
        'timestamp' : data['shipments'][0]['events'][0]['timestamp']
    }

    return render(request, 'tracking/index.html', context)
