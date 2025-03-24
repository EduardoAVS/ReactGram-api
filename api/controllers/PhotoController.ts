import { error } from "console";
import Photo from "../models/Photo";
import User from "../models/User";
import { Request, Response } from "express";

import mongoose from "mongoose";
import { AuthenticatedRequest } from "../interfaces/IUser";
import { photoInsertValidation } from "../middlewares/photoValidation";

// Inserir foto com um usuário relacionado

export const insertPhoto = async(req: Request, res: Response) => {
    const { title } = req.body;
    const image = req.file?.filename;
    
    if(!req.user){
        new Error("Usuário não encontrado");
        return ;
    }

    const reqUser = req.user;

    const user = await User.findById(reqUser._id);

    if(!user){
        new Error("Usuário não encontrado");
        return;
    } 

    const newPhoto = await Photo.create({
        image, title, userId: user._id, userName: user.name,
    });

    if(!newPhoto){
        res.status(422).json({
            errors: ["Houve um problema, tente novamente mais tarde."]
        })
        return;
    };

    res.status(201).json(newPhoto);

}

// Remover Photo

export const deletePhoto = async (req: AuthenticatedRequest, res: Response) => {
    const { id } = req.params;

    if (!req.user) {
        res.status(401).json({ errors: ["Usuário não autenticado"] });
        return;
    }

    const reqUser = req.user;

    try {
        const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

        if (!photo || !photo.userId) {
            res.status(404).json({ errors: ["Foto não encontrada!"] });
            return;
        }

        // Converter photo.userId para ObjectId antes da comparação
        const photoUserId = new mongoose.Types.ObjectId(photo.userId.toString());
        const reqUserId = new mongoose.Types.ObjectId(reqUser._id as string);

        if (!photoUserId.equals(reqUserId)) {
            res.status(403).json({
                errors: ["Você não tem permissão para excluir esta foto."],
            });
            return;
        }

        await Photo.findByIdAndDelete(photo._id);

        res.status(200).json({ _id: photo._id, message: "Foto excluída com sucesso" });
    } catch (error) {
        console.error("Erro ao deletar foto:", error);
        res.status(404).json({ errors: ["Foto não encontrada."] });
    }
};

export const getAllPhotos = async (req: Request, res: Response) => {

    const photos = await Photo.find({}).sort([["createdAt", -1]]).exec();

    res.status(200).json(photos);
    
    return;
}

export const getUserPhotos = async (req: Request, res: Response) => {

    const { id } = req.params;

    const photos = await Photo.find({ userId: id})
        .sort([["createdAt", -1]]).exec();



    res.status(200).json(photos);
    
    return;
}

export const getPhotoById = async (req: Request, res: Response) => {

    const { id } = req.params;

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // Verifica se a foto existe
    if(!photo){
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }

    res.status(200).json(photo);
    
    return;
}

export const updatePhoto = async (req: AuthenticatedRequest, res: Response) => {

    const { id } = req.params;

    const { title } = req.body;

    if (!req.user) {
            res.status(401).json({ errors: ["Usuário não autenticado"] });
            return;
    }

    const reqUser  = req.user;

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));
    

    // Verifica se a foto e seu usuário existem
    if(!photo || !photo.userId){
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }

    const reqUserId = new mongoose.Types.ObjectId(reqUser._id as string);
    const photoUserId = new mongoose.Types.ObjectId(photo.userId.toString());

    // Check if photo belongs to user
    if(!photoUserId.equals(reqUserId)){
        res.status(422).json({ errors: ["Ocorreu um erro, por favor tente novamente mais tarde."]})
    }

    if(title){
        photo.title = title;
    }

    await photo.save();

    res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
    
    return;
}

// Like

export const likePhoto = async (req: AuthenticatedRequest, res: Response) => {

    const { id } = req.params;

    if (!req.user) {
            res.status(401).json({ errors: ["Usuário não autenticado"] });
            return;
    }

    const reqUser  = req.user;

    const photo = await Photo.findById(new mongoose.Types.ObjectId(id));

    // Verifica se a foto e seu usuário existem
    if(!photo || !photo.userId){
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }

    // Verifica se o usuário já curtiu a foto
    if(photo.likes.includes(reqUser._id)){
        res.status(422).json({errors: ["Você já curtiu essa foto."]});
        return;
    }

    // Adiciona o ID do usuário no array de likes
    photo.likes.push(reqUser._id);

    await photo.save();

    res
    .status(200)
    .json({ photoId: id, userId: reqUser._id, message: "A foto foi curtida."})

    return;
}

// Comentários
export const commentPhoto = async (req: AuthenticatedRequest, res: Response) => {

    const { id } = req.params;

    const { comment } = req.body;

    if (!req.user) {
            res.status(401).json({ errors: ["Usuário não autenticado"] });
            return;
    }

    const reqUser  = req.user;

    const user = await User.findById(reqUser._id);
    
    const photo = await Photo.findById(id);

    // Verifica se a foto existe
    if(!user){
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }

    if(!photo){
        res.status(404).json({ errors: ["Foto não encontrada."] });
        return;
    }

    const userComment = {
        comment,
        userName: user.name,
        userImage: user.profileImage,
        userId: user._id,
    }

    photo.comments.push(userComment);

    await photo.save();

    res.status(200).json({ comment: userComment, message: "Comentário adicionado com sucesso!" });
    
    return;
}

// Procurar photo pelo título
export const searchPhotos = async (req: Request, res: Response) => {

    try {
        const { q } = req.query;

        // Verifica se 'q' está definido e é uma string válida
        if (!q || typeof q !== "string" || q.trim().length === 0) {
            res.status(400).json({ errors: ["A consulta de busca (q) é obrigatória e deve ser uma string válida."] });
            return;
        }

        const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

        if (!photos || photos.length === 0) {
            res.status(404).json({ errors: ["Nenhuma foto encontrada com esse título."] });
            return;
        }

        res.status(200).json(photos);
    } catch (error) {
        console.error("Erro ao buscar fotos:", error);
        res.status(500).json({ errors: ["Erro interno no servidor ao buscar fotos."] });
    }
}