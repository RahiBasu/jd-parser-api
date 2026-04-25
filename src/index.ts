import express from "express";
import cors from "cors";
import parseRouter from "./routes/parse";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "JD Parser API is running" });
});

app.use("/api", parseRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});