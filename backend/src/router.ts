import { Router } from "express"
import user from "./routes/user.routes.ts"
import resume from "./routes/resume.routes.ts"

export const router = Router()

router.use("/user", user)
router.use("/resume", resume)





