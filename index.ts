import "dotenv/config";
import express from "express";
import path from "path";
import cors from "cors";

import router from "./api/routes/Router";
import conn from "./api/config/db"; // Importa a conexão com o banco de dados
import { VercelRequest, VercelResponse } from "@vercel/node";

const port = process.env.PORT || 3000; // Defina um valor padrão caso o PORT não esteja definido

const app = express();

// Config JSON e form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({ credentials: false, origin: "https://react-gram-front.vercel.app", allowedHeaders: ["Content-Type", "Authorization"], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], }));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/public/uploads")));

// Rotas
app.use("/api", router);

// Conexão com o banco de dados
conn();

// Exportar a função handler para Vercel
export default (req: VercelRequest, res: VercelResponse) => {
  app(req, res); // Chama o app express diretamente
};
