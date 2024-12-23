import adafruit_dht
import board


dhtDevice = adafruit_dht.DHT22(board.D26)
temperature = dhtDevice.temperature
humidity = dhtDevice.humidity
print('Temp: {:.1f} C  Humidity: {}%'.format(temperature, humidity))
