# Documentation de l'API Plantagon

Cette documentation explique comment interagir avec l'API **Plantagon**, en particulier avec les points de terminaison `/infos` et `/add-data`.

---

## Configuration

- **Base URL** : `http://localhost:5500`

## Endpoints

### `/infos`

#### Description

Ce point de terminaison retourne des informations sur les plantes enregistrées dans la base de données entre deux dates données.

#### Méthode HTTP

`GET`

#### Paramètres

| Nom | Type   | Optionnel | Description                                            |
| --- | ------ | --------- | ------------------------------------------------------ |
| `f` | String | Oui       | Date de début du filtre, au format `YYYY-MM-DDThh:mm`. |
| `t` | String | Oui       | Date de fin du filtre, au format `YYYY-MM-DDThh:mm`.   |

#### Exemple de requête

```http
GET /infos?f=2024-01-01T00:00&t=2024-12-31T23:59 HTTP/1.1
Host: localhost:5500
```

#### Exemple de réponse

Code : `200 OK`

```json
[
  {
    "time": "2024-01-01T10:00",
    "temp": 22.5,
    "hygro": 55.1,
    "lum": 350.0,
    "hum": 45.0
  },
  {
    "time": "2024-01-02T12:30",
    "temp": 23.0,
    "hygro": 50.0,
    "lum": 400.0,
    "hum": 50.0
  }
]
```

#### Gestion des erreurs

| Code  | Message                                                                        | Explication                                              |
| ----- | ------------------------------------------------------------------------------ | -------------------------------------------------------- |
| `400` | {"error": "Veuillez fournir les paramètres f et t (format YYYY-MM-DDThh:mm)."} | Paramètres mal formés ou manquants.                      |
| `500` | {"error": "Erreur interne du serveur."}                                        | Problème interne, généralement lié à la base de données. |

---

### `/add-data`

#### Description

Ce point de terminaison permet d'ajouter une nouvelle entrée dans la base de données avec les données fournies par l'utilisateur.

#### Méthode HTTP

`POST`

#### Corps de la requête

Le corps de la requête doit être au format JSON avec les clés suivantes :

| Nom     | Type   | Requis | Description                                 |
| ------- | ------ | ------ | ------------------------------------------- |
| `time`  | String | Oui    | Date et heure au format `YYYY-MM-DDThh:mm`. |
| `temp`  | Number | Oui    | Température en degrés Celsius.              |
| `hygro` | Number | Oui    | Taux d'humidité en pourcentage.             |
| `lum`   | Number | Oui    | Niveau de luminosité en lux.                |
| `hum`   | Number | Oui    | Niveau d'humidité en pourcentage.           |

#### Exemple de requête

```http
POST /add-data HTTP/1.1
Host: localhost:5500
Content-Type: application/json

{
  "time": "2024-12-10T12:30",
  "temp": 22.5,
  "hygro": 60.2,
  "lum": 500.5,
  "hum": 55.0
}
```

#### Exemple de réponse

Code : `201 Created`

```json
{
  "message": "Données insérées avec succès."
}
```

#### Gestion des erreurs

| Code | Message                                                                           | Explication                                              |
| ---- | --------------------------------------------------------------------------------- | -------------------------------------------------------- |
| 400  | `{"error": "Les champs time, temp, hygro, lum et hum sont requis."}`              | Champs manquants dans le corps de la requête.            |
| 400  | `{"error": "Le champ time doit être au format YYYY-MM-DDThh:mm."}`                | Format de date invalide.                                 |
| 400  | `{"error": "Les champs temp, hygro, lum et hum doivent être des nombres réels."}` | Les valeurs ne sont pas valides.                         |
| 500  | `{"error": "Erreur interne du serveur lors de l'insertion."}`                     | Problème interne, généralement lié à la base de données. |

---

## Exemple de cas d'utilisation

### Ajouter une nouvelle donnée

**Requête :**

```http
POST /add-data HTTP/1.1
Host: localhost:5500
Content-Type: application/json

{
  "time": "2024-12-10T12:30",
  "temp": 22.5,
  "hygro": 60.2,
  "lum": 500.5,
  "hum": 55.0
}
```

**Résultat attendu :**

```json
{
  "message": "Données insérées avec succès."
}
```

---

## Auteur

Antonin Litschgy
