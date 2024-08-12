import { Router } from "express";
import { signIn } from "../controllers/user.controller.js";

export const router = Router();

router.route("/sign-in").post(signIn);
