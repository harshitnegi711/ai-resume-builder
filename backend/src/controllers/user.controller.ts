import bcrypt from "bcryptjs";
import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { AsyncHandler } from "../utils/AsyncHandler.ts";
import jwt from "jsonwebtoken"
import mongoose from "mongoose";

// ----- register user ---------------------------------------

const register = AsyncHandler(async (req, res) => {

  const { username, password, email, name } = req.body

  if ([username, password, email, name].some(_val => !_val?.trim())) throw new ApiError(400, "Fill all the required fields!!")

  const user = await User.create({
    username,
    email,
    name,
    password
  })

  res.status(200).json(ApiResponse(200, user, "user registered successfylly ."))
})


interface UserPayload extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  username: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ---------- generate access and refresh token ----------------------------------------

const generateAccessAndRefreshToken = (user: UserPayload): TokenPair => {
  const accessToken = jwt.sign(
    { id: user._id, email: user.email, username: user.username },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: (process.env.ACCESS_TOKEN_EXPIRY ?? '15m') as jwt.SignOptions['expiresIn'] }
  );

  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.REFRESH_TOKEN_SECRET!,
    { expiresIn: (process.env.REFRESH_TOKEN_EXPIRY ?? '7d') as jwt.SignOptions['expiresIn'] }
  );

  return { accessToken, refreshToken };
};




// --------- login user -------------------------------------

const login = AsyncHandler(async (req, res) => {

  const { email, password } = req.body

  if ([email, password].some(_val => !_val?.trim())) throw new ApiError(400, "email and password is required.")

  const user = await User.findOne({ email })

  if (!user) throw new ApiError(403, "user dose not exist ")

  const isPasswordCorrect = await bcrypt.compare(password, user.password)

  if (!isPasswordCorrect) throw new ApiError(500, "Invalid password.")

  const { accessToken, refreshToken } = generateAccessAndRefreshToken(user as unknown as UserPayload)

  if ([accessToken, refreshToken].some(_val => !_val.trim())) throw new ApiError(500, "error in token generation")
  user.refreshToken = refreshToken
  user.save()

  const options = { httpOnly: true, secure: true }

  res.status(200)
    .cookie("accesstoken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(ApiResponse(200, user, "successfully logged in "))

})



export { register, login }
