from django.shortcuts import render
import requests
import json

# Create your views here.

def index(request,codigo):
    url = "https://api-eu.dhl.com/track/shipments"

    headers = {
        'Accept': 'application/json',
        'DHL-API-Key': 'dGmqZ7RmVGHGkLWYR8y28C7qMsDtiMmn'
        }
    payload = {
        'trackingNumber': "'"+ codigo + "'",
        #8426939231
        #5551260643
        'service': 'express'
    }
    # This url is for testing 
    url = 'https://api-eu.dhl.com/track/shipments'
    resp = requests.get(url, params=payload, headers=headers)
    
    data = json.loads(resp.text)
    
    context = {
        'last_location' : data['shipments'][0]['events'][0]['location']['address']['addressLocality'],
        'description' : data['shipments'][0]['events'][0]['description'],
        'timestamp' : data['shipments'][0]['events'][0]['timestamp']
    }
    
    if(resp == 200):
        return 1
    else:
        return 0

