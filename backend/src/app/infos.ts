import { Request, Response } from "express";
import db from "./database";
import { PlantData } from "./types";

function infos(req: Request, res: Response): void {
  // Valeurs par défaut
  const defaultMinDate = "0000-01-01T00:00";
  const defaultMaxDate = "9999-12-31T23:59";

  // Récupérer les paramètres
  const f: string = (req.query.f as string) || defaultMinDate;
  const t: string = (req.query.t as string) || defaultMaxDate;

  // Préparer la requête SQL
  const query = `
        SELECT time, temp, hygro, lum, hum 
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
}

export default infos;
