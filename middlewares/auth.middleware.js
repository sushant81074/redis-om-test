import jsonwebtoken from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { userRepository } from "../models/user.model.js";

export const auth = async (req, res, next) => {
  try {
    const accessToken =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!accessToken) throw new ApiError(404, "token not found");

    const tokenData = jsonwebtoken.verify(
      accessToken,
      "process.env.ACCESS_TOKEN_SECRET"
    );

    console.log(tokenData);
    if (!tokenData || !tokenData.email)
      throw new ApiError(401, "invalid access token");

    if (tokenData?.exp && tokenData.exp < Date.now() / 1000)
      throw new ApiError(401, "token has been expired");

    const user = await userRepository
      .search()
      .where("email")
      .equals(tokenData.email)
      .return.first();

    if (!user) throw new ApiError(404, "user with email not found");

    req.user = user;

    next();
  } catch (error) {
    console.error("error during auth :", error?.message);

    return res
      .status(error?.statusCode || 500)
      .send(new ApiError(error?.statusCode || 500, error?.message));
  }
};
