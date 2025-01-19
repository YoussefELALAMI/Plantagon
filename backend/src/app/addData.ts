import { Request, Response } from "express";
import db from "./database";

function addData(req: Request, res: Response): void {
  if (!req || !req.body) {
    res.status(400).json({ error: "Le corps de la requête était vide" });
    return;
  }

  // Récupérer les paramètres du corps de la requête
  const { plantId, time, temp, hygro, lum, hum } = req.body;
  console.log(req.body);

  // Vérifier que tous les champs requis sont présents
  if (
    !plantId ||
    !time ||
    temp === undefined ||
    hygro === undefined ||
    lum === undefined ||
    hum === undefined
  ) {
    res
      .status(400)
      .json({ error: "Les champs time, temp, hygro, hum et lum sont requis." });
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

  // Convertir la date en format ISO (YYYY-MM-DDTHH:mm:ss)
  const timeFormatted = timeParsed.toISOString().slice(0, 16);

  // Vérifier que les valeurs sont des nombres
  const tempParsed = parseFloat(temp);
  const hygroParsed = parseFloat(hygro);
  const lumParsed = parseFloat(lum);
  const humParsed = parseFloat(hum);

  if (
    isNaN(tempParsed) ||
    isNaN(hygroParsed) ||
    isNaN(lumParsed) ||
    isNaN(humParsed)
  ) {
    res.status(400).json({
      error:
        "Les champs temp, hygro, hum et lum doivent être des nombres réels.",
    });
    return;
  }

  // Préparer la requête SQL pour insérer les données
  const query = `
    INSERT INTO plantData (plant_id, time, temp, hygro, lum, hum)
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.run(
    query,
    [plantId, timeFormatted, tempParsed, hygroParsed, lumParsed, humParsed],
    (err) => {
      if (err) {
        console.error("Erreur lors de l'insertion :", err.message);
        return res
          .status(500)
          .json({ error: "Erreur interne du serveur lors de l'insertion." });
      }

      res.status(201).json({ message: "Données insérées avec succès." });
    }
  );
}

export default addData;
