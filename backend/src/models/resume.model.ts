import mongoose from "mongoose";

const ExperienceSchema = new mongoose.Schema({
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String },
  startDate: { type: String },
  endDate: { type: String },
  bullets: [{ type: String }],
  current: { type: Boolean, default: false },
}, { _id: true });

const EducationSchema = new mongoose.Schema({
  school: { type: String, required: true },
  degree: { type: String },
  startDate: { type: String },
  endDate: { type: String },
}, { _id: true });

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  techStack: [{ type: String }],
  liveUrl: { type: String },
  githubUrl: { type: String },
}, { _id: true });

const ResumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "My Resume" },
  template: { type: String, enum: ["modern", "minimal", "classic"], default: "modern" },

  personalInfo: {
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    location: { type: String },
    linkedin: { type: String },
    github: { type: String },
    website: { type: String },
  },

  summary: { type: String },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  skills: [{ type: String }],

  // isPublic: { type: Boolean, default: false },

}, { timestamps: true });

export const Resume = mongoose.model("Resume", ResumeSchema);
