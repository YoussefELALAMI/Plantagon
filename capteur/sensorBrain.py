import socket
import time
import requests
from humiditySensor import readHumidity
from luminositySensor import readLuminosity
import struct

# Constants for the socket between c++ sensor and python
IP_SERVER = "192.168.1.15"
PORT_SERVER = 8080
BUFFER_SIZE = 16384
MAIN_LOOP_DELAY = 60 # delay in seconds to read the socket

def get_local_ip():
    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(("8.8.8.8", 80))
        return s.getsockname()[0]


# Function to read the data from the sensor
def readDataHumidityAndTemperature():
    print("Waiting for data from sensor...")
    # Receive the humidity and temperature from the sensor
    data, addr = UDPServerSocket.recvfrom(BUFFER_SIZE)
    print("Received data from sensor:", data)
    if len(data) == 8:  # 2 floats = 8 bytes
        temp, humidity = struct.unpack('ff', data)  # 'ff' signifie deux floats
        print(f"Received from sensor - Temperature: {temp:.2f}°C, Humidity: {humidity:.2f}%")
        return temp, humidity
    else:
        print("Received data has unexpected length")
        return None, None

    return data
#POST /add-data HTTP/1.1
# Host: localhost:5500
# Content-Type: application/json

# {
#   "time": "2024-12-10T12:30",
#   "temp": 22.5,
#   "hygro": 60.2,
#   "lum": 500.5
# }


def sendData(hygro, temp, lum,hydro):
    try:
        # Send the angles to the server

        # URL du serveur Node.js
        url = "http:// " + IP_SERVER + ":5500/add-data"
        print(url)

        # Données à envoyer
        payload = {
            "plantId": IP_SERVER,
            "time": time.strftime("%Y-%m-%dT%H:%M:%S"),
            "temp": temp,
            "hygro": hygro,
            "lum": lum,
            "hum": hydro

        }

        print("Sending data to server:", payload)

        # En-têtes HTTP
        headers = {
            "Content-Type": "application/json"
        }

        response = requests.post(url, json=payload, headers=headers)

        # Vérification de la réponse
        if response.status_code in [200, 201]:
            print("Données envoyées avec succès :", response.json())
        else:
            print(f"Erreur: {response.status_code}, {response.text}")
    except requests.exceptions.RequestException as e:
        print(f"Erreur lors de l'envoi des données : {e}")


# Create a datagram socket to data sensor from python 
UDPServerSocket = socket.socket(family=socket.AF_INET, type=socket.SOCK_DGRAM)

# Bind to address and ip
IP_SERVER = get_local_ip()
print(IP_SERVER)
UDPServerSocket.bind((IP_SERVER, PORT_SERVER))
#IP_SERVER = "ip"
print(f"UDP server up and listening on {IP_SERVER}")


# Main loop
while True:
    print("Reading data from sensors...")
    temp, hygro = readDataHumidityAndTemperature()
    lum = readLuminosity()
    hydro = readHumidity()
    print(f"Temperature: {temp:.2f}°C, Hygrometry: {hygro:.2f}%, Luminosity: {lum:.2f} lux, Humidity: {hydro:.2f}%")
    sendData(hygro, temp, lum,hydro)
    time.sleep(MAIN_LOOP_DELAY)



