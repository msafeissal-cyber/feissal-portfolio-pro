const express = require("express");
const fetch = require("node-fetch"); // install with npm if using Node <18
const app = express();

app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("API is running ✅");
});

// Text generation endpoint
app.post("/generate-text", async (req, res) => {
  const userPrompt = req.body.prompt;

  // Replace with your real OpenAI API key
  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4.1-mini",
      messages: [{ role: "user", content: userPrompt }]
    })
  });
  const data = await response.json();
  res.json({ result: data.choices[0].message.content });
});

// Image generation endpoint
app.post("/generate-image", async (req, res) => {
  const prompt = req.body.prompt;
  const OPENAI_API_KEY = "YOUR_OPENAI_API_KEY";

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      prompt: prompt,
      size: "1024x1024"
    })
  });
  const data = await response.json();
  res.json({ image_url: data.data[0].url });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
