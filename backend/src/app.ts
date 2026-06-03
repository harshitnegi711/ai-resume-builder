import express, { json } from "express"
import { router } from "./router.ts"
import cookieParser from "cookie-parser"

const app = express()

app.use(json({ limit: "20kb" }))
app.use(cookieParser())

app.use("/ai-resume-builder/api/v1", router)






export default app
