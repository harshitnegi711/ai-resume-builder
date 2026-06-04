import { Router } from "express";
import { login, logout, register } from "../controllers/user.controller.ts";
import { verifyJwt } from "../middleware/verifyJwt.ts";

const router = Router()

router.post("/register", register)
router.post("/login", login)
router.get("/logout", verifyJwt, logout)



export default router
