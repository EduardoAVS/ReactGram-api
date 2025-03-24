import "dotenv/config"; 
import express from "express";
import path from "path";
import cors from "cors";

import router from "./api/routes/Router";
import conn from "./api/config/db"; // Importa a conexão com o banco de dados

const port = process.env.PORT;

const app = express();

// Config JSON e form data response
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Solve CORS
app.use(cors({ credentials: true, origin: '*' }));

// Upload directory
app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

// Rotas
app.use(router);

app.listen(port, () => {
    console.log(`App rodando na porta ${port}`);
});

conn();
