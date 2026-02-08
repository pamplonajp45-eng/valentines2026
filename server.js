import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve static files from the dist directory
app.use(express.static(path.join(__dirname, "dist")));

// API endpoint for sending invitation (no database, just returns success)
app.post("/api/send-invitation", (req, res) => {
  const { accepted } = req.body;
  res.json({
    success: true,
    message: accepted ? "Yowwn! Lezgoooe 💕" : "ARAAAAW KO 🥺",
  });
});

// Serve the React app for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
