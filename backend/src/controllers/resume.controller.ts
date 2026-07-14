import path from "node:path"
import { fileURLToPath } from "url";
import ejs from "ejs"
import type { AuthRequest } from "../middleware/verifyJwt.ts"
import { Resume } from "../models/resume.model.ts"
import { User } from "../models/user.model.ts"
import { ApiError } from "../utils/ApiError.ts"
import { ApiResponse } from "../utils/ApiResponse.ts"
import { AsyncHandler } from "../utils/AsyncHandler.ts"
import puppeteer from "puppeteer"
import { title } from "node:process";
import { model } from "../utils/gemeni.ts";


const createResume = AsyncHandler(async (req: AuthRequest, res) => {
  const { title, template, personalInfo, summary, experience, projects, skills, education } = req.body
  const user = await User.findById(req.user._id)

  if (!user) throw new ApiError(405, "Invalid Access")

  const resume = await Resume.create({ userId: user._id, title, template, personalInfo, summary, experience, projects, skills, education })

  if (!resume) throw new ApiError(500, "error creating the resume")

  res.status(200).json(ApiResponse(200, resume, "resume created"))
})


const getResume = AsyncHandler(async (req: AuthRequest, res) => {

  const user = await User.findById(req.user._id)

  if (!user) throw new ApiError(405, "Invalid Access")

  const resumes = await Resume.find({ userId: user._id })

  if (!resumes) throw new ApiError(405, "resumes not found")

  res.status(200).json(ApiResponse(200, resumes, "resuems fetched successfully"))

})

const getResumeById = AsyncHandler(async (req: AuthRequest, res) => {

  const user = await User.findById(req.user._id)
  if (!user) throw new ApiError(405, "Invalid Access")

  const { resume_id } = req.params
  if (!resume_id) throw new ApiError(401, "Resume id is missing !")

  const resume = await Resume.findById(resume_id)

  if (!resume) throw new ApiError(405, "resume not found !")

  res.status(200).json(ApiResponse(200, resume, "resuems fetched successfully"))

})


const updateResume = AsyncHandler(async (req: AuthRequest, res) => {

  const user = await User.findById(req?.user._id)
  if (!user) throw new ApiError(403, "Unauthorized access !")

  const { resumeId, resumeContent } = req.body

  if (!resumeId) throw new ApiError(405, "resume id is missing ! ")

  const resume = await Resume.findOne({
    _id: resumeId,
    userId: user._id,
  });

  if (!resume) throw new ApiError(403, "Resume not found !")

  const updatedResume = await Resume.findByIdAndUpdate(resumeId, resumeContent, { new: true })

  res.status(200).json(ApiResponse(200, updatedResume, "Resume successfylly updated."))
})

const downloadResume = AsyncHandler(async (req: AuthRequest, res) => {

  const user = await User.findById(req?.user._id)
  if (!user) throw new ApiError(403, "Unauthorized Access !")

  const { resume_id } = req.params

  const resume = await Resume.findOne({ _id: resume_id, userId: user._id })
  if (!resume) throw new ApiError(402, "Resume not found !!")

  const templatePath = path.join(process.cwd(), "src/views/index.ejs");

  const html = await ejs.renderFile(templatePath, {
    title: resume.title || "",
    personalInfo: resume.personalInfo || {},
    summary: resume.summary || "",
    experience: resume.experience || [],
    education: resume.education || [],
    projects: resume.projects || [],
    skills: resume.skills || [],
  })

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  })

  const page = await browser.newPage()
  await page.setContent(html, { waitUntil: "domcontentloaded" })

  const pdf = await page.pdf({
    format: "A4",
    printBackground: true,
    margin: { top: "0px", bottom: "0px", left: "0px", right: "0px" },
  })

  await browser.close()

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="${resume.title}.pdf"`);
  res.send(pdf);

})

// ----- Generate Summart ------------------------------------------- //

const generateAiSummary = AsyncHandler(async (req: AuthRequest, res) => {

  const { resumeId } = req.body

  const resume = await Resume.findOne({ _id: resumeId, userId: req.user._id })
  if (!resume) throw new ApiError(405, "Resume not found !!")

  const { personalInfo, experience, skills, projects } = resume;

  const prompt = `
You are a professional resume writer.
Write a short, compelling professional summary for this person's resume.

Details:
- Name: ${personalInfo?.name || ""}
- Skills: ${skills?.join(", ") || ""}
- Experience: ${experience?.map(e => `${e.role} at ${e.company}`).join(", ") || ""}
- Projects: ${projects?.map(p => p.name).join(", ") || ""}

Rules:
- 3 sentences max
- Do not use "I" — write in third person or omit subject
- Make it ATS friendly
- Return ONLY the summary text, no explanation, no quotes
`;

  const result = await model.generateContent(prompt);
  const summary = result.response.text().trim();

  res.status(200).json(ApiResponse(200, summary, "Successfully fetched summary."))
})

export { createResume, getResume, updateResume, getResumeById, downloadResume, generateAiSummary }
