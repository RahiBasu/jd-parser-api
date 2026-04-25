import { Router, Request, Response } from "express";
import { z } from "zod";
import {
  extractSkills,
  extractExperience,
  extractName,
  extractEmail,
  extractEducation,
  extractSummary,
} from "../utils/extractor";

const router = Router();

const resumeSchema = z.object({
  text: z.string().min(20, "Too short").max(10000, "Too long"),
});

router.post("/parse", async (req: Request, res: Response) => {
  const validation = resumeSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.flatten().fieldErrors });
    return;
  }

  const { text } = validation.data;
  const experience = extractExperience(text) as { min: number | null; max: number | null };

  res.json({
    name: extractName(text),
    email: extractEmail(text),
    skills: extractSkills(text),
    experience_years: experience.max || experience.min || 0,
    education: extractEducation(text),
    summary: extractSummary(text),
  });
});

export default router;