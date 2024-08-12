import { Repository, Schema } from "redis-om";
import redisClient from "../client.js";

const notesSchema = new Schema(
  "Notes",
  {
    title: { type: "string" },
    content: { type: "string" },
    color: { type: "string" },
    user: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

export const notesRepository = new Repository(notesSchema, redisClient);
notesRepository.createIndex({ title: notesSchema.title });
