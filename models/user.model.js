import { Repository, Schema } from "redis-om";
import redisClient from "../client.js";

const userSchema = new Schema(
  "User",
  {
    username: { type: "string" },
    email: { type: "string" },
    password: { type: "string" },
  },
  {
    dataStructure: "JSON",
  }
);

export const userRepository = new Repository(userSchema, redisClient);
userRepository.createIndex({ username: userSchema.username });
