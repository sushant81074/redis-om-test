import express from "express";
import { router as user } from "./routes/user.routes.js";
import { router as notes } from "./routes/notes.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "home page redis-om-test", statusCode: 200 });
});

app.use("/user", user);
app.use("/notes", notes);

app.listen(8080, () => console.log("server running on port 8080"));
