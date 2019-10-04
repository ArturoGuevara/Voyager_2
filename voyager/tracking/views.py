from django.shortcuts import render
import requests
import json

# Create your views here.

def index(request):
    
    
    url = "https://api-eu.dhl.com/track/shipments"

    headers = {
        'Accept': 'application/json',
        'DHL-API-Key': 'dGmqZ7RmVGHGkLWYR8y28C7qMsDtiMmn'
        }
    payload = {
        'trackingNumber': '5551260643',
        'service': 'express'
    }

    # This url is for testing 
    url = 'https://api-eu.dhl.com/track/shipments'
    resp = requests.get(url, params=payload, headers=headers)
    json_data = resp.json()
    

    print(resp.content)
    
    
    
    context = {
        
    }
    return render(request, 'tracking/index.html', json_data)

