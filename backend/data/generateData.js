// Fonction pour générer des valeurs aléatoires
function generateRandomData() {
  const temp = (Math.random() * (30 - 15) + 15).toFixed(1); // Température entre 15 et 30°C
  const hygro = (Math.random() * (80 - 50) + 50).toFixed(1); // Humidité entre 50% et 80%
  const lum = (Math.random() * (1000 - 100) + 100).toFixed(1); // Luminosité entre 100 et 1000 unités
  return { temp, hygro, lum };
}

// Fonction pour envoyer une donnée à l'endpoint /add-data
function sendData(time, data) {
  fetch(`http://${baseURL}/add-data`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      time: time,
      temp: data.temp,
      hygro: data.hygro,
      lum: data.lum,
    }),
  })
    .then((response) => response.json())
    .then((json) => console.log("Donnée envoyée:", json))
    .catch((error) =>
      console.error("Erreur lors de l'envoi des données:", error)
    );
}

// Fonction pour générer et envoyer 200 données
function generateAndSendData() {
  let startDate = new Date("2025-01-01T00:00:00");
  let endDate = new Date("2025-01-14T23:59:59");

  let currentDate = startDate;
  let dataCount = 0;

  // Envoi de 200 données
  while (dataCount < 200 && currentDate <= endDate) {
    const time = currentDate.toISOString().slice(0, -8); // Formate la date au format YYYY-MM-DDThh:mm
    const data = generateRandomData();

    // Envoi de la donnée
    sendData(time, data);

    // Incrémenter de 5 minutes
    currentDate = new Date(currentDate.getTime() + 5 * 60000); // 5 minutes en millisecondes
    dataCount++;
  }
}

// Lancer l'envoi des données
generateAndSendData();
