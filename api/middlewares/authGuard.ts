import { Request, Response, NextFunction } from "express";
import User from "../models/User";
import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET as string;

export const authGuard = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    // Verifica se há um token no cabeçalho
    if (!token) {
        res.status(401).json({ errors: ["Acesso negado."] });
        return;
    }

    try {
        // Verifica o token JWT
        const verified = jwt.verify(token, jwtSecret) as { id: string };

        // Busca o usuário e armazena em req.user
        req.user = await User.findById(verified.id).select("-password");

        next();
    } catch (error) {
        res.status(401).json({ errors: ["Token inválido."] });
    }
};

// Funções assíncronas devem retornar Promise<T>
// Middleware do express devem retornar void ou Promise<void>
