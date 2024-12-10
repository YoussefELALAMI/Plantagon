# Documentation de l'API Plantagon

Cette documentation explique comment interagir avec l'API **Plantagon**, en particulier avec le point de terminaison `/infos`.

---

## Configuration

- **Base URL** : `http://localhost:5500`

---

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
    "Time": "2024-01-01T10:00",
    "temp": 22.5,
    "hygro": 55.1,
    "lum": 350.0
  },
  {
    "Time": "2024-01-02T12:30",
    "temp": 23.0,
    "hygro": 50.0,
    "lum": 400.0
  }
]
```

#### Gestion des erreurs

| Code | Message                                                                          | Explication                                               |
| ---- | -------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 400  | `{"error": "Veuillez fournir les paramètres f et t (format YYYY-MM-DDThh:mm)."}` | Paramètres mal formés ou manquants (si logique modifiée). |
| 500  | `{"error": "Erreur interne du serveur."}`                                        | Problème interne, généralement lié à la base de données.  |

---

## Exemple de cas d'utilisation

### Filtrer les données entre deux dates spécifiques

**Requête :**

```http
GET /infos?f=2024-01-01T00:00&t=2024-12-31T23:59 HTTP/1.1
```

**Résultat attendu :**

```json
[
  {
    "Time": "2024-01-01T10:00",
    "temp": 22.5,
    "hygro": 55.1,
    "lum": 350.0
  },
  {
    "Time": "2024-01-02T12:30",
    "temp": 23.0,
    "hygro": 50.0,
    "lum": 400.0
  }
]
```

---

### Obtenir toutes les données disponibles

**Requête :**

```http
GET /infos HTTP/1.1
```

**Résultat attendu :**
Retourne toutes les données de la base de données

---

### Notes importantes

- Si aucune donnée n'est disponible dans la plage spécifiée, le serveur retourne un tableau vide (`[]`).

---

### Auteur

Antonin Litschgy
