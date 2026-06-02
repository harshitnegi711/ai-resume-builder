import { Router } from "express"
import user from "./routes/user.routes.ts"

export const router = Router()

router.use("/user", user)




