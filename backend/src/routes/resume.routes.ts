import { Router } from "express";
import { createResume, downloadResume, generateAiSummary, getResume, getResumeById, updateResume } from "../controllers/resume.controller.ts";
import { verifyJwt } from "../middleware/verifyJwt.ts";

const router = Router()

router.post("/create", verifyJwt, createResume)
router.get("/get", verifyJwt, getResume)
router.get("/get/:resume_id", verifyJwt, getResumeById)
router.put("/update", verifyJwt, updateResume)
router.get("/download/:resume_id", verifyJwt, downloadResume)
router.post("/generate-summary", verifyJwt, generateAiSummary)

export default router
