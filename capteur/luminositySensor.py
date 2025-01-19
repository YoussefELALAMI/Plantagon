import board
import adafruit_tcs34725


def readLuminosity():
    i2c = board.I2C()  # uses board.SCL and board.SDA
    sensor = adafruit_tcs34725.TCS34725(i2c)

    temp = sensor.color_temperature
    lux = sensor.lux

    #print('Temperature: {0}K Lux: {1}'.format(temp, lux))
    #print('Color: ({0}, {1}, {2})'.format(*sensor.color_rgb_bytes))

    #compute the luminosity
    luminosity = lux
    return luminosity

