import { Request, Response } from "express";
import db from "./database";

function addPlant(req: Request, res: Response): void {
    if (!req || !req.body) {
        res.status(400).json({ error: "Le corps de la requête était vide" });
        return;
    }
    
    const { id, name, type, reference_humidite, reference_temperature, reference_luminosite, reference_humidite_sol } = req.body;

    if ( !id || !name || !type || !reference_humidite || !reference_temperature || !reference_luminosite || !reference_humidite_sol ) {
        res.status(400).json({ error: "Les champs name, type et reference sont requis." });
        return;
    }

    const query = `INSERT INTO plants (id, name, type, reference_humidite, reference_temperature, reference_luminosite, reference_humidite_sol) VALUES (?, ?, ?, ?, ?, ?, ?)`;

    db.run(query, [id, name, type, reference_humidite, reference_temperature, reference_luminosite, reference_humidite_sol], function(err) {
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
