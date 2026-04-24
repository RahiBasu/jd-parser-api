import { Router, Request, Response } from "express";
import { z } from "zod";
import { extractSkills, extractExperience, extractLocation, extractWorkType, extractJobTitle } from "../utils/extractor";
import prisma from "../lib/db";

const router = Router();

const parseSchema = z.object({
  text: z.string().min(20, "Text too short — must be at least 20 characters")
         .max(5000, "Text too long — max 5000 characters")
});

router.post("/parse", async (req: Request, res: Response) => {
  const validation = parseSchema.safeParse(req.body);

  if (!validation.success) {
    res.status(400).json({ error: validation.error.flatten().fieldErrors });
    return;
  }

  const { text } = validation.data;
  const experience = extractExperience(text) as { min: number | null, max: number | null, unit: string };

  const result = await prisma.parsedJob.create({
    data: {
      raw_text: text,
      job_title: extractJobTitle(text),
      skills: extractSkills(text),
      exp_min: experience.min,
      exp_max: experience.max,
      location: extractLocation(text),
      work_type: extractWorkType(text),
    }
  });

  res.json(result);
});

router.get("/jobs", async (req: Request, res: Response) => {
  const jobs = await prisma.parsedJob.findMany({
    orderBy: { created_at: "desc" }
  });

  res.json(jobs);
});

export default router;