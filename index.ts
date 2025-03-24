import "dotenv/config"; 
import express from "express";
import path from "path";
import cors from "cors";

import router from "./api/routes/Router";
import conn from "./api/config/db"; // Importa a conexão com o banco de dados
import { VercelRequest, VercelResponse } from "@vercel/node";

const port = process.env.PORT;

const app = express();

// Config JSON e form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({ credentials: true, origin: '*', allowedHeaders: ["Content-Type", "Authorization"], 
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"], }));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Rotas
app.use("/api" ,router);

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});

conn();

export default (req: VercelRequest, res: VercelResponse) => {
    return app(req, res);
  };
