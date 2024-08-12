import { Router } from "express";
import { auth } from "../middlewares/auth.middleware.js";
import {
  createNote,
  deleteNote,
  getAllNotes,
  getNote,
  updateNote,
} from "../controllers/notes.controller.js";

export const router = Router();

router.use(auth);

router.route("/").post(createNote).get(getAllNotes);
router.route("/:title").patch(updateNote).get(getNote).delete(deleteNote);
