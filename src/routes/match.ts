import { Router, Request, Response } from "express";
import { z } from "zod";
import { extractSkills } from "../utils/extractor";

const router = Router();

const matchSchema = z.object({
  resume_text: z.string().min(20),
  jd_text: z.string().min(20),
});

router.post("/", async (req: Request, res: Response) => {
  const validation = matchSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.flatten().fieldErrors });
    return;
  }

  const { resume_text, jd_text } = validation.data;

  const resumeSkills = extractSkills(resume_text);
  const jdSkills = extractSkills(jd_text);

  const matched_skills = resumeSkills.filter((s) => jdSkills.includes(s));
  const missing_skills = jdSkills.filter((s) => !resumeSkills.includes(s));

  const match_score =
    jdSkills.length > 0
      ? Math.round((matched_skills.length / jdSkills.length) * 100)
      : 0;

  const recommendation =
    match_score >= 70
      ? "Strong match — you should apply for this role."
      : match_score >= 40
      ? "Moderate match — consider upskilling in the missing areas."
      : "Low match — significant skill gaps. Focus on the missing skills first.";

  res.json({
    match_score,
    matched_skills,
    missing_skills,
    recommendation,
  });
});

export default router;