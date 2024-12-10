import app from "./app";
const PORT = process.env.PORT || "5500";
// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`Serveur Express démarré sur le port ${PORT}`);
});
