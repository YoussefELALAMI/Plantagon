import adafruit_dht
import board

# Initialisation du capteur sur GPIO4 (modifiable selon votre connexion)
dht_device = adafruit_dht.DHT22(board.D17)
print(dht_device)

try:
    while True:
        try:
            dht_device.measure()
            print(dht_device.measure())
            # Lire la température et l'humidité
            temperature = dht_device.temperature
            humidity = dht_device.humidity

            # Afficher les résultats
            print(f"Température : {temperature:.1f}°C")
            print(f"Humidité : {humidity:.1f}%")

        except RuntimeError as error:
            # Les erreurs courantes (capteur non prêt) sont normales
            print(f"Erreur : {error.args[0]}")

        time.sleep(2.0)
except KeyboardInterrupt:
    print("Arrêt du programme.")
finally:
    # Nettoyer la ressource du capteur
    dht_device.exit()