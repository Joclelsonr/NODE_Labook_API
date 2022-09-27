import { Router } from "express";
import userController from "../UserDependecies";

export const userRouter = Router();

userRouter.post("/signup", userController.signup);
userRouter.post("/login", userController.login);
userRouter.put("/auth", userController.auth);
