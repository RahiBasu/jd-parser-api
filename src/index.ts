import express from "express";
import cors from "cors";
import parseRouter from "./routes/parse";
import resumeRouter from "./routes/resume";
import matchRouter from "./routes/match";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "JD Parser API is running" });
});

app.use("/api", parseRouter);
app.use("/api/resume", resumeRouter);
app.use("/api/match", matchRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});