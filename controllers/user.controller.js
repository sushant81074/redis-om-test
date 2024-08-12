import { userRepository } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const options = {
  httpOnly: true,
  secur: false,
};

export const signIn = async (req, res) => {
  try {
    let { username, email, password } = req.body;

    let userExists = await userRepository
      .search()
      .where("email")
      .equals(email)
      .return.first();

    console.log(userExists);

    if (!userExists) {
      password = await bcrypt.hash(password, 10);
      userExists = await userRepository.save({ username, email, password });
    }

    let accessToken = await jwt.sign(
      { username: userExists.username, email: userExists.email },
      "process.env.ACCESS_TOKEN_SECRET",
      { expiresIn: "1d" }
    );

    delete userExists["password"];

    return res
      .cookie("accessToken", accessToken, options)
      .status(200)
      .send(
        new ApiResponse(
          200,
          { userExists, accessToken },
          "user sign-in successful"
        )
      );
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};

export const signOut = async (req, res) => {
  try {
    if (!req.user || !req.user?.email)
      throw new ApiError(401, "unauthorized user");

    return res
      .clearCookie("accessToken", options)
      .status(200)
      .send(new ApiResponse(200, {}, "user sign-out successful"));
  } catch (error) {
    console.error("error :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};
