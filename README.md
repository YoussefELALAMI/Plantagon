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
├── frontend/          # Contiendra le code React pour l'interface utilisateur\
├── backend/           # Contiendra le Serveur Node.js avec base SQLite\
├── raspberry-pi/      # Contiendra les scripts Python la gestion des capteurs\
├── README.md          # Documentation principale\
└── .gitignore         # Fichiers/dossiers à ignorer\

## Technologies utilisées
- **Frontend** : React + TypeScript
- **Backend** : Node.js + Express + SQLite
- **Base de données** : SQLite
- **Microcontrôleur** : Python (avec Raspberry Pi 3)
