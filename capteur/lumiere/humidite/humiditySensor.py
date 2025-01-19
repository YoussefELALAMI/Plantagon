import spidev
import time

# # Configuration SPI
# spi = spidev.SpiDev()
# spi.open(0, 0)  # Bus 0, Device 0 (CE0)
# spi.max_speed_hz = 1350000

MAX_VOLTAGE = 2.6
MIN_VOLTAGE = 1.25

def init_SPI():
    spi = spidev.SpiDev()
    spi.open(0, 0)  # Bus 0, Device 0 (CE0)
    spi.max_speed_hz = 1350000
    return spi  


def compute_humidity(voltage):
    # Calcul de l'humidité relative
    dryness = (voltage - MIN_VOLTAGE) / (MAX_VOLTAGE - MIN_VOLTAGE) * 100
    return 100 -dryness

# Fonction pour lire un canal spécifique (0 à 7) du MCP3208
def read_channel(channel, spi):
    if channel < 0 or channel > 7:
        raise ValueError("Le canal doit être entre 0 et 7")

    # Envoi de la commande au MCP3208
    # Le format est : 0000 0001 | CCxx xxxx | xxxx xxxx
    cmd1 = 0b00000110 | ((channel & 0b100) >> 2)  # Les 3 premiers bits pour le début et le canal MSB
    cmd2 = (channel & 0b011) << 6  # Les 2 bits suivants pour le canal LSB
    adc = spi.xfer2([cmd1, cmd2, 0])

    # Combine les deux derniers octets pour obtenir la valeur brute (12 bits)
    value = ((adc[1] & 0x0F) << 8) | adc[2]
    return value

def readHumidity():
    spi = init_SPI()
    try :
        channel_0_value = read_channel(0, spi)
        voltage = (channel_0_value * 3.3) / 4095  # Conversion en tension (3.3V max)
        humidity = compute_humidity(voltage)
        return humidity
    except KeyboardInterrupt:
        spi.close()
# Lecture d'un canal en boucle
# try:
#     while True:
#         channel_0_value = read_channel(0)
#         voltage = (channel_0_value * 3.3) / 4095  # Conversion en tension (3.3V max)
#         print(f"Canal 0 : Valeur brute = {channel_0_value}, Tension = {voltage:.2f}V")
#         humidity = compute_humidity(voltage)
#         print(f"Humidité relative : {humidity:.2f}%")
#         time.sleep(1)
# except KeyboardInterrupt:
#     spi.close()