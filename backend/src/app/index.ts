import express from "express";
import cors from "cors";
import infos from "./infos";
import addData from "./addData";
import getLastInfo from "./getLastInfo";
import addPlant from "./addPlant";
import getPlants from "./getPlants";

// Configuration du serveur
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint : /infos?f=A&t=B
app.get("/infos", infos);
app.post("/add-data", addData);
app.get("/last-info", getLastInfo);

app.post("/add-plant", addPlant);
app.get("/plants", getPlants);

export default app;
