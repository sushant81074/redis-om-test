import express from "express";
import { router as user } from "./routes/user.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ message: "home page redis-om-test", statusCode: 200 });
});

app.use("/user", user);

app.listen(8080, () => console.log("server running on port 8080"));
