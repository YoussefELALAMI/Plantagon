import RPi.GPIO as GPIO

GPIO.setmode(GPIO.BCM)
GPIO.setup(26, GPIO.IN)

print("État de GPI26 : ", GPIO.input(26))
GPIO.cleanup()
