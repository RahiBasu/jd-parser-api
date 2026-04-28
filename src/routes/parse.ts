import { Router, Request, Response } from "express";
import { z } from "zod";
import { extractSkills, extractExperience, extractLocation, extractWorkType, extractJobTitle } from "../utils/extractor";
import prisma from "../lib/db";
import { requireAuth } from "../middleware/requireAuth";

const router = Router();

const parseSchema = z.object({
  text: z.string().min(20).max(5000)
});

router.use(requireAuth);

router.post("/parse", async (req: Request, res: Response) => {
  const validation = parseSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({ error: validation.error.flatten().fieldErrors });
    return;
  }

  const { text } = validation.data;
  const userId = (req as any).userId;
  const experience = extractExperience(text) as { min: number | null, max: number | null, unit: string };

  const result = await prisma.parsedJob.create({
    data: {
      userId,
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
  const userId = (req as any).userId;
  const jobs = await prisma.parsedJob.findMany({
    where: { userId },
    orderBy: { created_at: "desc" }
  });
  res.json(jobs);
});

export default router;