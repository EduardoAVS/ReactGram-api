import mongoose, { Document } from "mongoose";
import { Request } from "express";


export interface IUser extends Document {
    _id: mongoose.Types.ObjectId;
    name: string;
    email: string;
    password: string;
    profileImage?: string;
    bio?: string;
    createdAt?: Date;
    updatedAt?: Date;
}



export interface AuthenticatedRequest extends Request {
    user?: IUser | mongoose.Document;
}




