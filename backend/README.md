# Documentation de l'API Plantagon

Cette documentation explique comment interagir avec l'API **Plantagon**, conçue pour gérer les données des plantes et suivre leurs conditions en temps réel.

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

| Nom      | Type   | Optionnel | Description                                            |
| -------- | ------ | --------- | ------------------------------------------------------ |
| `plantId`| String | Non       | Identifiant unique de la plante.                      |
| `f`      | String | Oui       | Date de début du filtre, au format `YYYY-MM-DDThh:mm`. |
| `t`      | String | Oui       | Date de fin du filtre, au format `YYYY-MM-DDThh:mm`.   |

#### Exemple de requête

```http
GET /infos?plantId=123&f=2024-01-01T00:00&t=2024-12-31T23:59 HTTP/1.1
Host: localhost:5500
```

#### Exemple de réponse

Code : `200 OK`

```json
[
  {
    "plant_id": "192.89.90.1",
    "time": "2024-01-01T10:00",
    "temp": 22.5,
    "hygro": 55.1,
    "lum": 350.0,
    "hum": 45.0
  },
  {
    "plant_id": "192.89.90.1",
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
| `400` | {"error": "Le plant_id est requis."}                                        | Le paramètre `plantId` est manquant.                    |
| `500` | {"error": "Erreur interne du serveur."}                                     | Problème interne, généralement lié à la base de données. |

---

### `/add-data`

#### Description

Ce point de terminaison permet d'ajouter une nouvelle entrée dans la base de données avec les données fournies par l'utilisateur.

#### Méthode HTTP

`POST`

#### Corps de la requête

Le corps de la requête doit être au format JSON avec les clés suivantes :

| Nom      | Type   | Requis | Description                                 |
| -------- | ------ | ------ | ------------------------------------------- |
| `plantId`| String | Oui    | Identifiant unique de la plante.            |
| `time`   | String | Oui    | Date et heure au format `YYYY-MM-DDThh:mm`. |
| `temp`   | Number | Oui    | Température en degrés Celsius.              |
| `hygro`  | Number | Oui    | Taux d'humidité en pourcentage.             |
| `lum`    | Number | Oui    | Niveau de luminosité en lux.                |
| `hum`    | Number | Oui    | Niveau d'humidité en pourcentage.           |

#### Exemple de requête

```http
POST /add-data HTTP/1.1
Host: localhost:5500
Content-Type: application/json

{
  "plantId": "192.89.90.1",
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
| 400  | {"error": "Les champs time, temp, hygro, hum et lum sont requis."}            | Champs manquants dans le corps de la requête.            |
| 400  | {"error": "Le champ time doit être au format YYYY-MM-DDThh:mm."}              | Format de date invalide.                                 |
| 400  | {"error": "Les champs temp, hygro, lum et hum doivent être des nombres réels."}| Les valeurs ne sont pas valides.                         |
| 500  | {"error": "Erreur interne du serveur lors de l'insertion."}                   | Problème interne, généralement lié à la base de données. |

---

### `/add-plant`

#### Description

Ce point de terminaison permet d'ajouter une nouvelle plante avec ses références spécifiques dans la base de données.

#### Méthode HTTP

`POST`

#### Corps de la requête

Le corps de la requête doit être au format JSON avec les clés suivantes :

| Nom                     | Type   | Requis | Description                                  |
| ----------------------- | ------ | ------ | -------------------------------------------- |
| `id`                   | String | Oui    | Identifiant unique de la plante.            |
| `name`                 | String | Oui    | Nom de la plante.                           |
| `type`                 | String | Oui    | Type de plante.                             |
| `reference_humidite`   | Number | Oui    | Taux d'humidité de référence.               |
| `reference_temperature`| Number | Oui    | Température de référence.                   |
| `reference_luminosite` | Number | Oui    | Niveau de luminosité de référence.          |
| `reference_humidite_sol`| Number| Oui    | Humidité du sol de référence.               |

#### Exemple de requête

```http
POST /add-plant HTTP/1.1
Host: localhost:5500
Content-Type: application/json

{
  "id": "192.89.90.1",
  "name": "Aloe Vera",
  "type": "Succulent",
  "reference_humidite": 50,
  "reference_temperature": 22,
  "reference_luminosite": 400,
  "reference_humidite_sol": 30
}
```

#### Exemple de réponse

Code : `201 Created`

```json
{
  "message": "Plante ajoutée avec succès.",
  "plantId": 123
}
```

#### Gestion des erreurs

| Code | Message                                                               | Explication                                              |
| ---- | --------------------------------------------------------------------- | -------------------------------------------------------- |
| 400  | {"error": "Les champs name, type et reference sont requis."}       | Champs manquants ou mal formés dans le corps de la requête. |
| 500  | {"error": "Erreur interne du serveur."}                            | Problème interne, généralement lié à la base de données. |

---

### `/plants`

#### Description

Ce point de terminaison retourne la liste des plantes enregistrées dans la base de données.

#### Méthode HTTP

`GET`

#### Exemple de requête

```http
GET /plants HTTP/1.1
Host: localhost:5500
```

#### Exemple de réponse

Code : `200 OK`

```json
[
  {
    "id": "192.89.90.1",
    "name": "Aloe Vera",
    "type": "Succulent",
    "reference_humidite": 50,
    "reference_temperature": 22,
    "reference_luminosite": 400,
    "reference_humidite_sol": 30
  },
  {
    "id": "192.89.90.2",
    "name": "Basilic",
    "type": "Herbe",
    "reference_humidite": 60,
    "reference_temperature": 20,
    "reference_luminosite": 500,
    "reference_humidite_sol": 40
  }
]
```

#### Gestion des erreurs

| Code | Message                                   | Explication                                              |
| ---- | ----------------------------------------- | -------------------------------------------------------- |
| 500  | {"error": "Erreur interne du serveur."}| Problème interne, généralement lié à la base de données. |

---

## Exemple de cas d'utilisation

### Ajouter une nouvelle donnée

**Requête :**

```http
POST /add-data HTTP/1.1
Host: localhost:5500
Content-Type: application/json

{
  "plantId": "192.89.90.1",
  "time": "2024-12-15T08:45",
  "temp": 21.8,
  "hygro": 58.0,
  "lum": 450.2,
  "hum": 52.3
}
```

**Réponse :**

```json
{
  "message": "Données insérées avec succès."
}
```

### Ajouter une nouvelle plante

**Requête :**

```http
POST /add-plant HTTP/1.1
Host: localhost:5500
Content-Type: application/json

{
  "id": "192.89.90.3",
  "name": "Cactus",
  "type": "Succulent",
  "reference_humidite": 40,
  "reference_temperature": 25,
  "reference_luminosite": 600,
  "reference_humidite_sol": 20
}
```

**Réponse :**

```json
{
  "message": "Plante ajoutée avec succès.",
  "plantId": "192.89.90.3"
}
```

### Récupérer les informations d'une plante

**Requête :**

```http
GET /infos?plantId=125&f=2024-12-01T00:00&t=2024-12-31T23:59 HTTP/1.1
Host: localhost:5500
```

**Réponse :**

```json
[
  {
    "time": "2024-12-10T10:00",
    "temp": 24.0,
    "hygro": 45.0,
    "lum": 550.0,
    "hum": 40.0
  },
  {
    "time": "2024-12-15T08:45",
    "temp": 21.8,
    "hygro": 58.0,
    "lum": 450.2,
    "hum": 52.3
  }
]
```

---

## Notes

- Les points de terminaison ont été conçus pour être simples et intuitifs.
- La validation des données est effectuée côté serveur pour garantir l'intégrité des entrées.
- Toutes les erreurs incluent des messages explicites pour aider les développeurs à identifier et corriger les problèmes rapidement.

## Prochaines étapes

- Implémenter une authentification pour renforcer la sécurité de l'API.
- Intégrer un système de notifications en temps réel pour informer les utilisateurs des conditions critiques des plantes.

