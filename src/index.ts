import express from "express";
import { spawn } from "child_process";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json());

// Route to run codex -p with prompt
app.post("/prompt", (req, res: any) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res
        .status(400)
        .json({ success: false, error: "Prompt is required" });
    }

    // TODO: See about using "--full-context" as well if needed
    const codexProcess = spawn("codex", [
      "--full-auto",
      "--dangerously-auto-approve-everything",
      "-q",
      prompt,
    ]);

    let output = "";
    let errorOutput = "";

    codexProcess.stdout.on("data", (data) => {
      output += data.toString();
    });

    codexProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
    });

    codexProcess.on("close", (code) => {
      if (code === 0) {
        res.status(200).json({ success: true, output });
      } else {
        res.status(500).json({
          success: false,
          error: errorOutput || "Process exited with code " + code,
        });
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).send("OK");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
