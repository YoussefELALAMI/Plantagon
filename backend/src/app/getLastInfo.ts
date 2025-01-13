import { Request, Response } from "express";
import db from "./database";

function getLastinfo(req: Request, res: Response): void {
  // Requête SQL pour récupérer la ligne avec le temps maximum
  const query = `
    SELECT * 
    FROM plantData
    WHERE time = (SELECT MAX(time) FROM plantData)
  `;

  db.get(query, [], (err, row) => {
    if (err) {
      console.error("Erreur lors de la récupération des données :", err.message);
      res.status(500).json({ error: "Erreur interne du serveur" });
      return;
    }

    if (!row) {
      res.status(404).json({ message: "Aucune donnée trouvée" });
      return;
    }

    // Retourner la dernière donnée trouvée
    res.status(200).json(row);
  });
}

export default getLastinfo;
