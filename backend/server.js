const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();

// Cpnnexion à la base de données
const dbPath = path.join(__dirname, "data", "plantagon.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error(
      "Erreur lors de la connexion à la base de données :",
      err.message
    );
  } else {
    console.log("Connecté à la base de données SQLite.");
  }
});

// Endpoint de la racine
app.get("/", (req, res) => {
  res.send("Serveur en cours de fonctionnement !");
});

// Endpoint : /info?f=A&t=B
app.get("/infos", (req, res) => {
  // Valeurs par défaut
  const defaultMinDate = "0000-01-01T00:00";
  const defaultMaxDate = "9999-12-31T23:59";

  // Récupérer les paramètres
  const f = req.query.f || defaultMinDate;
  const t = req.query.t || defaultMaxDate;

  // Préparer la requête SQL
  const query = `
    SELECT time, temp, hygro, lum 
    FROM plantData
    WHERE time BETWEEN ? AND ? 
    ORDER BY time ASC
  `;

  // Exécuter la requête
  db.all(query, [f, t], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }

    // Retourner les données en JSON
    res.json(rows);
  });
});

// Démarrage du serveur
const PORT = 5500;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Fermer la base de données proprement lors de la sortie
process.on("SIGINT", () => {
  db.close((err) => {
    if (err) {
      console.error(
        "Erreur lors de la fermeture de la base de données :",
        err.message
      );
    } else {
      console.log("Base de données SQLite fermée.");
    }
    process.exit(0);
  });
});
