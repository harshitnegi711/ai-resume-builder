import mongoose, { Document, Types } from "mongoose";

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

// --- TypeScript interface ---
export interface IResume extends Document {
  userId: Types.ObjectId;
  title: string;
  template: "modern" | "minimal" | "classic";
  personalInfo: {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  };
  summary?: string;
  experience?: mongoose.Types.DocumentArray<any>;
  education?: mongoose.Types.DocumentArray<any>;
  projects?: mongoose.Types.DocumentArray<any>;
  skills?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// --- Main schema ---
const ResumeSchema = new mongoose.Schema<IResume>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, default: "My Resume" },
  template: { type: String, enum: ["modern", "minimal", "classic"], default: "modern" },
  personalInfo: {
    name: String, email: String, phone: String,
    location: String, linkedin: String, github: String, website: String,
  },
  summary: { type: String },
  experience: [ExperienceSchema],
  education: [EducationSchema],
  projects: [ProjectSchema],
  skills: [{ type: String }],
}, { timestamps: true });

ResumeSchema.index({ userId: 1, createdAt: -1 });

export const Resume = mongoose.model<IResume>("Resume", ResumeSchema);
