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

    //db.run(`DROP TABLE IF EXISTS plants;`);

    // Création de la table des plantes 
    db.run(
      `CREATE TABLE IF NOT EXISTS plants (
        id TEXT PRIMARY KEY NOT NULL,
        name TEXT UNIQUE NOT NULL,
        type TEXT NOT NULL,
        reference_humidite REAL NOT NULL,
        reference_temperature REAL NOT NULL,
        reference_luminosite REAL NOT NULL,
        reference_humidite_sol REAL NOT NULL
      );`
    );

    //db.run(`DROP TABLE IF EXISTS plantData;`); // This removes the old table

     // Création de la table plantData avec une clé étrangère
     db.run(
      `CREATE TABLE IF NOT EXISTS plantData (
        plant_id TEXT NOT NULL,
        time TEXT NOT NULL,
        temp REAL NOT NULL,
        hygro REAL NOT NULL,
        lum REAL NOT NULL,
        hum REAL NOT NULL,
        FOREIGN KEY (plant_id) REFERENCES plants(id) ON DELETE CASCADE
      );`
    );    
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
