import User from "../models/User";
import { Request, Response } from "express";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const jwtSecret = process.env.JWT_SECRET as string;


// Gennerate User token

const generateToken = (id: string) => {
    return jwt.sign({id}, jwtSecret, {expiresIn: "7d",})
}

// Register user and sign in

export const register = async(req: Request, res: Response) => {
    const { name, email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({email});

    if(user){
        res.status(422).json({errors: ["Utilize outro email."]});
        return;
    } 

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    // Create user
    const newUser = await User.create({
        name, email, password: passwordHash
    })

    // Retorna token
    if(!newUser){
        res.status(422).json({errors: ["Houve um erro, porfavor tente mais tarde."]});
        return;
    }

    res.status(201).json({
        _id: newUser._id.toString(),
        token: generateToken(newUser._id.toString()),
    })
};

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if(!user){
        res.status(404).json({ errors: ["Usuário não encontrado."]});
        return;
    }

    if(!(await bcrypt.compare(password, user.password!))){
        res.status(422).json({errors: ["Senha Inválida."]})
        return;
    }

    res.status(201).json({
        _id: user._id.toString(),
        profileImage: user.profileImage,
        token: generateToken(user._id.toString()),
    })
}

// get usuário Logado

export const getCurrentUser = async(req: Request, res: Response) => {
    const user = req.user;

    res.status(200).json(user);
}

export const update = async (req: Request, res:Response) => {
    
    const { name, password, bio } = req.body

    let profileImage = null;

    if(req.file){
        profileImage = req.file.filename
    }
    if(!req.user){
        new Error("Usuário não encontrado");
        return ;
    }
    const reqUser = req.user;

    const user = await User.findById(new mongoose.Types.ObjectId((reqUser._id!).toString())).select("-password");

    if(!user){
        new Error("Usuário não encontrado");
        return;
    } 

    if(name){
        user.name = name
    }
    if(password){
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);
        user.password = passwordHash;
    }
    if(profileImage){
        user.profileImage = profileImage
    }
    if(bio){
        user.bio = bio
    }

    await user.save();

    res.status(200).json(user);
}

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    // Verifica se o ID é válido
    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ errors: ["ID de usuário inválido."] });
        return;
    }

    try {
        const user = await User.findById(id).select("-password"); 

        if (!user) {
            res.status(404).json({ errors: ["Usuário não encontrado."] });
            return;
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ errors: ["Erro ao buscar usuário."] });
    }
};