# Plantagon 🌱

**Plantagon** est une application connectée pour surveiller l’état de vos plantes en temps réel grâce à des capteurs.

## Fonctionnalités principales
- Mesurer l'humidité, la température, la luminosité, et l'humidité du sol.
- Une interface interactive qui montre l'état de la plante de manière animée.
- Historique des données pour surveiller l'évolution de vos plantes.

## Structure du Projet
Voici la structure de ce projet :
plantagon/
├── frontend/          # Contiendra le code React pour l'interface utilisateur
├── backend/           # Contiendra le Serveur Node.js avec base SQLite
├── raspberry-pi/      # Contiendra les scripts Python la gestion des capteurs
├── README.md          # Documentation principale
└── .gitignore         # Fichiers/dossiers à ignorer


## Technologies utilisées
- **Frontend** : React + TypeScript
- **Backend** : Node.js + Express + SQLite
- **Microcontrôleur** : Python (avec Raspberry Pi 3)