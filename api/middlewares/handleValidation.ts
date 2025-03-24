import { validationResult } from "express-validator";
import { Request, Response, NextFunction } from "express";

export const validate = (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if(errors.isEmpty()){
        return next();
    }

    const extractedErrors: string[] = [];
    errors.array().map((err) => extractedErrors.push(err.msg));

    res.status(422).json({
        errors: extractedErrors,
    });
}

// O express espera que um Middleware retorne void ou Promise<void>