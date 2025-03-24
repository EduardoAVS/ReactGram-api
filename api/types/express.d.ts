import { Request } from "express";
import { Document } from "mongoose"; 

declare module "express" {
  export interface Request {
    user?: Document | null;
  }
}
