import { notesRepository } from "../models/notes.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

export const createNote = async (req, res) => {
  try {
    if (!req.user || !req.user?.email)
      throw new ApiError(401, "unauthorised user");

    const { title, content, color } = req.body;

    const noteWithTitleExists = await notesRepository
      .search()
      .where("title")
      .equals(title.trim())
      .return.first();

    if (noteWithTitleExists)
      throw new ApiError(409, "note with same title already exists");

    let newNote = await notesRepository.save({
      title,
      content,
      color,
      user: req.user.email,
    });

    if (!newNote) throw new ApiError(500, "new note creation unsuccessful");

    return res
      .status(201)
      .send(new ApiResponse(201, newNote, "note created successfully"));
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

export const getNote = async (req, res) => {
  try {
    if (!req.user || !req.user.email)
      throw new ApiError(401, "unauthorised user");

    const { title } = req.params;

    if (!title) throw new ApiError(400, "title not sent");

    const noteWithTitleExists = await notesRepository
      .search()
      .where("title")
      .equals(title.trim())
      .return.first();

    if (!noteWithTitleExists)
      throw new ApiError(404, "note with title not found");

    return res
      .status(200)
      .send(
        new ApiResponse(
          200,
          { note: noteWithTitleExists },
          "note fetched successfully"
        )
      );
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

export const getAllNotes = async (req, res) => {
  try {
    if (!req.user || !req.user.email)
      throw new ApiError(401, "unauthorised user");

    const notes = await notesRepository
      .search()
      .where("user")
      .equals(req.user.email)
      .return.all();

    console.log(notes);

    return res
      .status(200)
      .send(new ApiResponse(200, notes, "all notes fetched successfully"));
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

export const updateNote = async (req, res) => {
  try {
    if (!req.user || !req.user?.email)
      throw new ApiError(401, "unauthorized user");

    const { title } = req.params;
    const { content, color } = req.body;

    if (!title) throw new ApiError(400, "title not sent");

    let noteId = await notesRepository
      .search()
      .where("title")
      .equals(title)
      .return.firstId();

    noteId = await notesRepository.fetch(noteId);

    noteId.content = content;
    noteId.color = color;

    let updtNote = await notesRepository.save(noteId);
    console.log("updtNote", updtNote);

    return res
      .status(200)
      .send(new ApiResponse(200, updtNote, "note updated successfully"));
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

export const deleteNote = async (req, res) => {
  try {
    if (!req.user || !req.user.email)
      throw new ApiError(401, "unauthorised user");

    const { title } = req.params;

    if (!title) throw new ApiError(400, "title not sent");

    let note = await notesRepository
      .search()
      .where("title")
      .equals(title)
      .return.firstId();

    // noteId = await notesRepository.fetch(noteId);

    // delete noteId["title"];
    // delete noteId["content"];
    // delete noteId["color"];
    // delete noteId["user"];
    // delete noteId["Symbol(entityId)"];
    // delete noteId["Symbol(entityKeyName)"];

    await notesRepository.expire(note, 0);

    return res
      .status(200)
      .send(new ApiResponse(204, note, "note deleted successfully"));
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};
