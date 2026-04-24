export function extractSkills(text: string): string[] {
  const skillKeywords = [
    "JavaScript", "TypeScript", "Python", "Java", "Node.js", "Express",
    "React", "Next.js", "PostgreSQL", "MongoDB", "MySQL", "Redis",
    "Docker", "AWS", "Git", "REST API", "GraphQL", "Linux"
  ];

  return skillKeywords.filter(skill =>
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

export function extractExperience(text: string): object {
  const match = text.match(/(\d+)\s*[-to]+\s*(\d+)\s*years?/i) ||
                text.match(/(\d+)\+?\s*years?/i);

  if (match) {
    return { min: parseInt(match[1]), max: parseInt(match[2] || match[1]), unit: "years" };
  }
  return { min: null, max: null, unit: "years" };
}

export function extractLocation(text: string): string | null {
  const cities = ["Bangalore", "Mumbai", "Delhi", "Hyderabad", "Chennai",
                  "Pune", "Kolkata", "Jaipur", "Remote"];

  const found = cities.find(city =>
    text.toLowerCase().includes(city.toLowerCase())
  );
  return found || null;
}

export function extractWorkType(text: string): string {
  if (/remote/i.test(text)) return "remote";
  if (/hybrid/i.test(text)) return "hybrid";
  if (/on-?site|in-?office/i.test(text)) return "onsite";
  return "not specified";
}
export function extractJobTitle(text: string): string | null {
  const titles = [
    "Backend Developer", "Frontend Developer", "Full Stack Developer",
    "Software Engineer", "Senior Software Engineer", "Junior Developer",
    "DevOps Engineer", "Data Engineer", "Mobile Developer",
    "Software Developer", "Web Developer", "Node.js Developer",
    "Python Developer", "Java Developer", "TypeScript Developer"
  ];

  const found = titles.find(title =>
    text.toLowerCase().includes(title.toLowerCase())
  );
  return found || null;
}