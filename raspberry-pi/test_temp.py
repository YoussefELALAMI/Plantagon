import time
import adafruit_dht
from board import D4  # Replace D4 with the actual GPIO pin

# Initialize the DHT sensor
dht_device = adafruit_dht.DHT22(D4)

while True:
    try:
        #temperature = dht_device.temperature
        humidity = dht_device.humidity
        print("éé")
        if temperature is not None and humidity is not None:
            print(f"Temp: {temperature:.1f} °C  Humidity: {humidity:.1f} %")
        else:
            print("Sensor read failed. Retrying...")
    except RuntimeError as error:
        # Handle occasional sensor read errors
        print("runtime error")
        print(f"Error: {error.args[0]}")
        time.sleep(2)
    except Exception as error:
        # Handle other errors (like GPIO access issues)
        dht_device.exit()
        raise error
    time.sleep(2)
