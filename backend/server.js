const express = require("express");
const app = express();

// Endpoint de la racine
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
