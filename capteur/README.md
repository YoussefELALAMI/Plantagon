# Gestion de trois capteurs dans ce projet

Ce projet intègre trois types de capteurs pour mesurer différentes variables environnementales :  

1. **Capteur d'humidité de l'air et de température** (DHT22)  
   - Géré via un code en C++ disponible dans le dossier `temperature`.  

2. **Capteur d'humidité du sol**  
   - Géré via un code en Python et le script humiditySensor.py  

3. **Capteur de luminosité**  
   - Géré via un code en Python  et le script luminositySensor.py  

---

## Bibliothèques utilisées

Ce projet repose sur plusieurs bibliothèques pour interagir avec les capteurs :  

- **Capteur d'humidité du sol** : `spiDev` pour la lecture des broches SPI.  
- **Capteur de luminosité** : `Adafruit TCS34725` pour la gestion des données de ce capteur.  
- **Capteur DHT22** : `WiringPi` pour accéder aux broches GPIO du Raspberry Pi et une bibliothèque dédiée au DHT22 incluse dans ce dépôt.  

---

## Fonctionnement

1. **Capteur DHT22**  
   - Le capteur transmet les données de température et d'humidité de l'air via une socket UDP, en utilisant le fichier `dht22.cpp` pour envoyer ces informations.

2. **Serveur de collecte des données**  
   - Le fichier `sensorBrain.py` gère les données provenant du capteur d'humidité du sol et du capteur de luminosité.  
   - Il reçoit également les données envoyées par le DHT22 via la socket UDP.  
   - Une fois les données collectées, elles sont transmises au serveur principal de l'application via le point d'entrée `"/addData/"`.  

3. **Boucle temporelle constante**  
   - Le script `sensorBrain.py` exécute cette collecte et transmission de manière cyclique, avec un intervalle de temps fixe défini dans le code.

---

Ce projet propose une architecture modulaire et interconnectée pour surveiller et transmettre des données environnementales en temps réel.
