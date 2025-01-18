import { Request, Response } from "express";
import db from "./database";

function addPlant(req: Request, res: Response): void {
    if (!req || !req.body) {
        res.status(400).json({ error: "Le corps de la requête était vide" });
        return;
    }
    
    const { name, type, reference } = req.body;

    if (!name || !type || !reference) {
        res.status(400).json({ error: "Les champs name, type et reference sont requis." });
        return;
    }

    const query = `INSERT INTO plants (name, type, reference) VALUES (?, ?, ?)`;

    db.run(query, [name, type, reference], function (err) {
        if (err) {
          console.error("Erreur lors de l'ajout de la plante :", err.message);
          res.status(500).json({ error: "Erreur interne du serveur." });
          return;
        }
      
        res.status(201).json({ 
          message: "Plante ajoutée avec succès.", 
          plantId: this.lastID // Ensure the last inserted ID is returned correctly
        });
      });
      
}

export default addPlant;
