import express, { Request, Response } from "express";
import sqlite3 from "sqlite3";
import path from "path";

// Définir les types pour la base de données
interface PlantData {
  Time: string;
  temp: number;
  hygro: number;
  lum: number;
}

// Configuration du serveur
const app = express();
const PORT = 5500;

// Chemin vers la base de données
const dbPath = path.join(__dirname, "../data", "plantagon.db");

// Connecter à la base de données SQLite
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

// Endpoint : /infos?f=A&t=B
app.get("/infos", (req: Request, res: Response) => {
  // Valeurs par défaut
  const defaultMinDate = "0000-01-01T00:00";
  const defaultMaxDate = "9999-12-31T23:59";

  // Récupérer les paramètres
  const f: string = (req.query.f as string) || defaultMinDate;
  const t: string = (req.query.t as string) || defaultMaxDate;

  // Préparer la requête SQL
  const query = `
    SELECT time as Time, temp, hygro, lum 
    FROM plantData 
    WHERE time BETWEEN ? AND ? 
    ORDER BY time ASC
  `;

  // Exécuter la requête
  db.all(query, [f, t], (err, rows: PlantData[]) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }

    // Retourner les données en JSON
    res.json(rows);
  });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
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
