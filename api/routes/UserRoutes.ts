import express from "express";
import { getCurrentUser, getUserById, login, register, update } from "../controllers/UserController";

import { validate } from "../middlewares/handleValidation";
import { loginValidation, userCreateValidation, userUpdateValidation } from "../middlewares/userValidation";
import { authGuard } from "../middlewares/authGuard";
import imageUpload from "../middlewares/imageUpload";


const router = express.Router();

router.post("/register", userCreateValidation() ,validate, register);
router.post("/login", loginValidation() ,validate, login);

router.get("/profile", authGuard, getCurrentUser);
router.put("/", authGuard, userUpdateValidation(), validate, imageUpload.single("profileImage"), update);

router.get("/:id", getUserById);

export default router;
