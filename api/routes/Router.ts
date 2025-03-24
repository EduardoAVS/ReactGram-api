import userRoutes from "./UserRoutes";
import photosRoutes from "./PhotosRoutes" 
import { Request, Response } from "express";
import { Router } from "express";

const router = Router();

router.use("/api/users", userRoutes); 
router.use("/api/photos", photosRoutes);

// Teste router
router.get("/", (req: Request, res: Response) => {
    res.send("API Working!");
});

export default router;
