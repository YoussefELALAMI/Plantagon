import { Request, Response } from "express";
import db from "./database";

function getLastInfo(req: Request, res: Response): void {
  const plantId = parseInt(req.query.plantId as string, 10);

  if (!plantId) {
    res.status(400).json({ error: "Le paramètre plantId est requis." });
    return;
  }

  const query = `
    SELECT * 
    FROM plantData
    WHERE plant_id = ? 
    ORDER BY time DESC
    LIMIT 1
  `;

  db.get(query, [plantId], (err, row) => {
    if (err) {
      console.error("Erreur lors de la récupération :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur" });
    }

    if (!row) {
      console.warn("Aucune donnée trouvée pour cette plante");
      return res.status(404).json({ message: "Aucune donnée trouvée pour cette plante." });
    }
    
    res.status(200).json(row);
  });
}

export default getLastInfo;
