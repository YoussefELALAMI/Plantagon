# PLANTAGON 🌱

## Description

Plantagon est une application innovante permettant de suivre l’état de votre plante via un avatar numérique. Grâce aux capteurs connectés, l’application affiche en temps réel des données telles que :

- Température
- Humidité du sol
- Luminosité

L’objectif : assurer le bien-être optimal de vos plantes et améliorer leur suivi.

## Fonctionnalités

- Visualisation de l’état de la plante via une animation interactive.
- Suivi des données en temps réel grâce à des capteurs connectés.
- Notifications sur les besoins immédiats de la plante.

## Architecture

Voici la structure de ce projet :
plantagon/ \
├── frontend/ # Contiendra le code React pour l'interface utilisateur\
├── backend/ # Contiendra le Serveur Node.js avec base SQLite\
├── raspberry-pi/ # Contiendra les scripts Python la gestion des capteurs\
└── README.md # Documentation principale\

---

## Prérequis

Avant de commencer, assurez-vous d’avoir les éléments suivants :

1. **Docker** : Installez Docker et Docker Compose.
   - Pour les instructions d’installation, consultez la documentation officielle : [Docker](https://docs.docker.com/get-docker/).
2. **Raspberry Pi** : Une Raspberry Pi 3 (ou ultérieure) configurée avec Python 3.

---

## Installation et Lancement

`docker-compose up`

---

## Technologies utilisées

- **Frontend** : React (TypeScript)
- **Backend** : Node.js (Express, TypeScript) avec SQLite
- **Microcontrôleur** : Python pour Raspberry Pi 3

---

## Auteurs

- Antonin Litschgy
- Charlotte Colome
- Loic Blanc
- Youssef El Alami

---

## Licence

Ce projet est sous licence [MIT](LICENSE).
