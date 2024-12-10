import { Request, Response } from "express";
import db from "./database";

function addData(req: Request, res: Response): void {
  if (!req || !req.body) {
    res.status(400).json({ error: "Le corps de la requête était vide" });
    return;
  }

  // Récupérer les paramètres du corps de la requête
  const { time, temp, hygro, lum } = req.body;

  // Vérifier que tous les champs requis sont présents
  if (!time || temp === undefined || hygro === undefined || lum === undefined) {
    res
      .status(400)
      .json({ error: "Les champs time, temp, hygro et lum sont requis." });
    return;
  }

  // Valider le format de la date
  const timeParsed = new Date(time);
  if (isNaN(timeParsed.getTime())) {
    res
      .status(400)
      .json({ error: "Le champ time doit être au format YYYY-MM-DDThh:mm." });
    return;
  }

  // Vérifier que les valeurs sont des nombres
  const tempParsed = parseFloat(temp);
  const hygroParsed = parseFloat(hygro);
  const lumParsed = parseFloat(lum);

  if (isNaN(tempParsed) || isNaN(hygroParsed) || isNaN(lumParsed)) {
    res.status(400).json({
      error: "Les champs temp, hygro et lum doivent être des nombres réels.",
    });
    return;
  }

  // Préparer la requête SQL pour insérer les données
  const query = `
      INSERT INTO plantData (time, temp, hygro, lum)
      VALUES (?, ?, ?, ?)
    `;

  // Exécuter la requête
  db.run(query, [timeParsed, tempParsed, hygroParsed, lumParsed], (err) => {
    if (err) {
      console.error("Erreur lors de l'insertion :", err.message);
      return res
        .status(500)
        .json({ error: "Erreur interne du serveur lors de l'insertion." });
    }

    // Retourner un message de succès
    res.status(201).json({ message: "Données insérées avec succès." });
  });
}

export default addData;
