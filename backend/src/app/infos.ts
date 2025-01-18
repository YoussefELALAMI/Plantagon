import { Request, Response } from "express";
import db from "./database";
import { PlantData } from "./types";

function infos(req: Request, res: Response): void {
  const { plantId, f, t } = req.query;
  const plant_id = parseInt(plantId as string, 10);

  if (!plantId) {
    res.status(400).json({ error: "Le plant_id est requis." });
    return;
  }

  const defaultMinDate = "0000-01-01T00:00";
  const defaultMaxDate = "9999-12-31T23:59";

  const query = `
    SELECT time, temp, hygro, lum, hum 
    FROM plantData 
    WHERE plant_id = ? AND time BETWEEN ? AND ? 
    ORDER BY time ASC
  `;

  db.all(query, [plantId, f || defaultMinDate, t || defaultMaxDate], (err, rows: PlantData[]) => {
    if (err) {
      console.error("Erreur lors de la requête :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }

    res.json(rows);
  });
}

export default infos;
