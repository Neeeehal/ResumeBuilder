// /api/generate.js

export default async function handler(req, res) {
  const { sectionPrompt, userPrompt } = req.body;

  if (!sectionPrompt || !userPrompt) {
    return res.status(400).json({ error: "Missing input" });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that generates professional resume entries based on user input."
          },
          {
            role: "user",
            content: `Generate a professional resume entry for the section '${sectionPrompt}' based on: ${userPrompt}`
          }
        ]
      })
    });

    const data = await response.json();
    const aiText = data.choices[0].message.content;
    res.status(200).json({ result: aiText });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "AI generation failed." });
  }
}
