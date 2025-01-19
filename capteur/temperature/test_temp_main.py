import RPi.GPIO as GPIO
import time

# Configuration de la broche GPIO
DHT_PIN = 27 # Modifiez en fonction de votre connexion au capteur

def read_dht22_raw(pin):
    """Lit les données brutes (timings des signaux) envoyées par le DHT22."""
    data = []

    # Configurer la broche comme sortie pour envoyer le signal de démarrage
    GPIO.setup(pin, GPIO.OUT)
    GPIO.output(pin, GPIO.LOW)
    time.sleep(0.02)  # Maintenir le signal bas pendant 20ms pour démarrer
    GPIO.output(pin, GPIO.HIGH)
    time.sleep(0.00002)  # Attendre 20µs avant de passer à la lecture

    # Configurer la broche comme entrée pour écouter le capteur
    GPIO.setup(pin, GPIO.IN, pull_up_down=GPIO.PUD_UP)

    # Lire les changements de niveau logique (timings des signaux)
    for _ in range(500):  # Boucle pour capturer les transitions
        data.append(GPIO.input(pin))

    return data

def parse_dht22_data(data):
    """Analyse les données brutes et extrait température et humidité."""
    bits = []
    lengths = []

    # Mesurer les durées des états HIGH
    count = 0
    for i in range(1, len(data)):
        if data[i] == data[i - 1]:
            print("count",count)
            count += 1
        else:
            print("else")
            lengths.append(count)
            count = 0
    if len(lengths) < 1 :
        lengths.append(count)

    # Supprimer les premiers signaux (de synchronisation)
    print('lengths',lengths)
    lengths = lengths[4:]

    # Chaque bit est représenté par la durée des signaux HIGH
    for i in range(0, len(lengths), 2):
        if i + 1 < len(lengths):
            bit_length = lengths[i + 1]
            # Un signal long correspond à un 1, un signal court correspond à un 0
            if bit_length > 10:  # Seuil à ajuster en fonction des timings
                bits.append(1)
            else:
                bits.append(0)

    # Regrouper les bits en octets
    humidity_bits = bits[0:16]
    temperature_bits = bits[16:32]
    checksum_bits = bits[32:40]

    # Convertir les bits en entiers
    print('avant',humidity_bits)
    print('avant',temperature_bits)
    humidity = int("".join(map(str, humidity_bits)), 2)
    temperature = int("".join(map(str, temperature_bits)), 2)
    checksum = int("".join(map(str, checksum_bits)), 2)

    # Vérifier le checksum
    if (humidity + temperature) & 0xFF != checksum:
        raise ValueError("Checksum invalide")

    # Retourner les valeurs
    return humidity / 10.0, temperature / 10.0

# Programme principal
if __name__ == "__main__":
    GPIO.setmode(GPIO.BCM)
    try:
        while True:
            raw_data = read_dht22_raw(DHT_PIN)  # Étape 1 : Lire les données brutes
            print("Données brutes :", raw_data)
            try:
                humidity, temperature = parse_dht22_data(raw_data)  # Étape 2 : Calculer
                print(f"Humidité : {humidity:.1f}% | Température : {temperature:.1f}°C")
            except ValueError as e:
                print(f"Erreur de lecture : {e}")
            time.sleep(2)  # Attendre 2 secondes avant la prochaine lecture
    except KeyboardInterrupt:
        print("Arrêt du programme")
    finally:
        GPIO.cleanup()
