import { Request, Response } from "express";
import db from "./database";

function getPlants(req: Request, res: Response): void {
  const query = `SELECT * FROM plants`;

  db.all(query, [], (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des plantes :", err.message);
      return res.status(500).json({ error: "Erreur interne du serveur." });
    }

    res.status(200).json(rows);
  });
}

export default getPlants;
