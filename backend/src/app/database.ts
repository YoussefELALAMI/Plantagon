import sqlite3 from "sqlite3";
import path from "path";

// Chemin vers la base de données
const dbPath = path.join(__dirname, "../../data", "plantagon.db");

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

export default db;
