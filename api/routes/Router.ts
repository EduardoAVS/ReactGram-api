import photoRoutes from "./PhotoRoutes"
import userRoutes from "./UserRoutes"


import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.use("/users", userRoutes); 
router.use("/photos", photoRoutes); 


// Teste router
router.get("/", (req: Request, res: Response) => {
    res.send("API Working!");
});

export default router;
