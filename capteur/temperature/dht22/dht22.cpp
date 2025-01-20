/*
Compile with 
g++ -std=c++14 dht22.cpp dht22lib.cpp -lwiringPi -o dht22.exe
*/


#include "dht22lib.h"
#include <iostream>
#include <cstring>
#include <sys/socket.h>
#include <arpa/inet.h>
#include <unistd.h>


#define PORT 8080
#define IP_ADRESS "192.168.181.34"
#define PIN 17
#define WAIT_BETWEEN_MEASURES 5000

DhtSensor initSensor(){
    // Set up wiringPi to use the regular GPIO pin numbers (http://wiringpi.com/reference/setup/)
    // These are the ones labelled as BCM, on the map shown with command ```gpio readall```
    if (wiringPiSetupGpio() == -1) {
        std::cout << "wiringPi setup failed";
        return 1;
    }

    DhtSensor sensor{PIN};

#ifdef DEBUG
    DhtSensor::printSignalTitle();
#endif

    return sensor;

}

std::pair<float,float> readDht22(DhtSensor sensor){
    
    do {
        sensor.read();
    } while (sensor.m_humidity > 100 || sensor.m_temperature > 100);
    #ifdef DEBUG
        sensor.printSignal();
    #endif
    
    printf("%-3.1f *C  Humidity: %-3.1f%%\n", sensor.m_temperature, sensor.m_humidity);

    return std::make_pair(sensor.m_temperature, sensor.m_humidity);

}

int initSocket() {
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    if (sock < 0) {
        std::cerr << "Erreur de création du socket\n";
        return -1;
    }
    return sock;


}

void sendData(int sock, float data[2],size_t dataSize ) {
    struct sockaddr_in serv_addr{};
    serv_addr.sin_family = AF_INET;
    serv_addr.sin_port = htons(PORT);
    inet_pton(AF_INET, IP_ADRESS, &serv_addr.sin_addr);
    printf("Sending data to %s:%d\n", IP_ADRESS, PORT);
    sendto(sock, data, dataSize, 0, (struct sockaddr*)&serv_addr, sizeof(serv_addr));
    printf("Data sent\n");
}

int main(int argc, char *argv[])
{
    float data[2];
    int sock = initSocket();
    if (sock < 0) {
        return -1;
    }
    DhtSensor sensor = initSensor();

    printf("Valide initSocket\n");
    std::pair<float,float> values;
    while(1){

        values = readDht22(sensor);
        data[0] = values.first;
        data[1] = values.second;
        delay(WAIT_BETWEEN_MEASURES);  // Wait between readings
        printf("temperature : %-3.1f humidity : %-3.1f\n",data[0],data[1]);
        sendData(sock, data, sizeof(data));


    }    
    close(sock);

}





