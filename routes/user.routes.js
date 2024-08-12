import { Router } from "express";
import { signIn, signOut } from "../controllers/user.controller.js";

export const router = Router();

router.route("/sign-in").post(signIn);
router.route("/sign-out").get(signOut);
