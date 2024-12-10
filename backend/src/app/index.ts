import express, { Request, Response } from "express";
import infos from "./infos";
import addData from "./addData";

// Configuration du serveur
const app = express();
app.use(express.json());

// Endpoint : /infos?f=A&t=B
app.get("/infos", infos);
app.post("/add-data", addData);

export default app;
