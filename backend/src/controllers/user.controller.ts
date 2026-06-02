import { User } from "../models/user.model.ts";
import { ApiError } from "../utils/ApiError.ts";
import { ApiResponse } from "../utils/ApiResponse.ts";
import { AsyncHandler } from "../utils/AsyncHandler.ts";

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

// --------- login user -------------------------------------

const login = AsyncHandler(async (req, res) => {



})



export { register, login }
