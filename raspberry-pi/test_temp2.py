import Adafruit_DHT
...
sensor = Adafruit_DHT.DHT11
pin = 4
humidity temperature = Adafruit_DHT.read_retry(capteur, pin)