import express, { Request, Response } from "express";
import cors from "cors";
import infos from "./infos";
import addData from "./addData";
import getLastInfo from "./getLastInfo";

// Configuration du serveur
const app = express();

// Liste des origines autorisées
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());

// Endpoint : /infos?f=A&t=B
app.get("/infos", infos);
app.post("/add-data", addData);
app.get("/last-info", getLastInfo);

export default app;
