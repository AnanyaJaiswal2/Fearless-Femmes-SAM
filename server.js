import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/scenario", async (req, res) => {
  try {
    const userInput = req.body.input || "general safety";
    const level = req.body.level || "easy";

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `
You are a women's safety training simulator.

Generate a UNIQUE scenario.

Difficulty: ${level}

Rules:
- Easy → obvious safe answer
- Medium → slightly tricky
- Hard → confusing, real-life ambiguity

Context: ${userInput}
RandomSeed: ${Date.now()}

Return ONLY JSON:
{
  "situation": "",
  "options": ["", "", "", ""],
  "correct": "",
  "feedback": ""
}
                  `,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 1,
            topP: 0.9,
          },
        }),
      }
    );

    const dataAI = await response.json();

    // 🔥 Extract full response safely
    const text =
      dataAI.candidates?.[0]?.content?.parts
        ?.map((p) => p.text)
        .join("") || "";

    console.log("RAW:", text);

    // 🔥 Clean JSON
    const clean = text
      .replace(/```json|```/g, "")
      .replace(/^[^{]*/, "")
      .replace(/[^}]*$/, "")
      .trim();

    let json;

    try {
      json = JSON.parse(clean);
    } catch (e) {
      console.log("JSON ERROR:", clean);

      // 🔥 RANDOM fallback (no repetition)
      const fallback = [
        {
          situation: "You are in a cab at night and driver changes route.",
          options: [
            "Ignore",
            "Call friend",
            "Share location",
            "Sleep",
          ],
          correct: "Share location",
          feedback: "Sharing location increases safety.",
        },
        {
          situation: "Someone follows you on a quiet street.",
          options: [
            "Ignore",
            "Run randomly",
            "Go to crowded place",
            "Confront",
          ],
          correct: "Go to crowded place",
          feedback: "Public places are safer.",
        },
        {
          situation: "You receive suspicious messages asking for personal info.",
          options: [
            "Reply",
            "Ignore",
            "Block & report",
            "Share info",
          ],
          correct: "Block & report",
          feedback: "Never share personal details online.",
        },
      ];

      json = fallback[Math.floor(Math.random() * fallback.length)];
    }

    res.json(json);
  } catch (err) {
    console.log("SERVER ERROR:", err);
    res.status(500).json({ error: "error" });
  }
});

app.listen(5000, () => console.log("✅ Server running on 5000"));