import express, { Request, Response } from "express";
import cors from "cors";
import infos from "./infos";
import addData from "./addData";
import getLastInfo from "./getLastInfo";

// Configuration du serveur
const app = express();

app.use(cors());
app.use(express.json());

// Endpoint : /infos?f=A&t=B
app.get("/infos", infos);
app.post("/add-data", addData);
app.get("/last-info", getLastInfo);

export default app;
