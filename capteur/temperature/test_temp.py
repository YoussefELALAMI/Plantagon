
import seeed_dht
# for DHT11 the type is '11', for DHT22 the type is '22'
sensor = seeed_dht.DHT("22", 17)
humi, temp = sensor.read()
print('DHT{0}, humidity {1:.1f}%, temperature {2:.1f}*'.format(sensor.dht_type, humi, temp))
