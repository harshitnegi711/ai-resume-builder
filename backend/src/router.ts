import { Router } from "express"

export const router = Router()


router.get("/", (req, res) => {

  res.send("hello this is working !!")
})




