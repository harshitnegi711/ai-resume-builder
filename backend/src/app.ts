import express, { json } from "express"
import { router } from "./router.ts"

const app = express()

app.use(json({ limit: "20kb" }))
app.use("/ai-resume-builder/api/v1", router)






export default app
