import type { Request } from "express";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import { AsyncHandler } from "../utils/AsyncHandler.ts";
import jwt from "jsonwebtoken"
import type { UserPayload } from "../controllers/user.controller.ts";

export interface AuthRequest extends Request {
  user?: any
}

export const verifyJwt = AsyncHandler(async (req: AuthRequest, res, next) => {

  const accessToken = req.cookies?.accessToken

  if (!accessToken) throw new ApiError(400, "no token found !")

  const decodedToken: any = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!)
  console.log("-------------> ", decodedToken)

  const user = await User.findById(decodedToken?._id).select("-refreshToken -password")

  if (!user) throw new ApiError(400, "invalid access !!")

  req.user = user

  next()

})
