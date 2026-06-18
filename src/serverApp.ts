import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Initialize Gemini SDK with custom User-Agent for modern build system telemetry
const apiKey = process.env.GEMINI_API_KEY || "";
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

app.use(express.json());

// API: Handle Gemini AI Receptionist conversation flow
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Invalid 'messages' array in request body." });
    }

    if (!ai) {
      // Graceful fallback if API key is not yet set up
      return res.status(200).json({
        text: "[Demo Mode - API Key not found in user secrets] Hello! I am the Apex Therm AI automated dispatch assistant. I can see you need emergency commercial HVAC diagnostic. What is the location of your property, your name, and what is the issue with your system? (Enter any details to simulate the back-office SMS & calendar ticket generation!)",
        isDemo: true
      });
    }

    const systemInstruction = `You are "Kore", the VocosAI Backup Dispatcher, an elite automated voice answering assistant for "Apex Comfort HVAC", a premium commercial industrial heating, ventilation, and air conditioning contractor.
Your objective is to answer professional inbound calls, collect essential triage details for emergency or routine repairs, and demonstrate VocosAI's incredible capabilities.

Keep all responses EXTREMELY concise (1 to 2 sentences max) as if spoken over a live telephone connection. Do not output big blocks of text or bullet lists. Speak in a warm, professional, and reassuring dispatcher tone.

Qualify the caller by gathering the following details:
1. Caller's Name & Company (e.g. "Sarah with Sunrise Property Management")
2. Property Address / Location
3. Equipment Type & Issue (e.g. Roof Top Unit blowing warm air, Commercial Chiller leaking, Ductwork noise)
4. Urgency (Emergency dispatch vs routine estimate)

Once you collected all details:
1. Re-confirm them briefly.
2. Tell them: "Done! I've logged your high-priority ticket. A calendar booking link and our dispatcher summary has been generated for your team. You will instantly receive an SMS receipt."
3. Invite them to review the simulated lead dispatch panel to your right.

If they say something out-of-bounds or irrelevant, politely guide them back to diagnosing their HVAC system.`;

    const contents = messages.map((m: any) => ({
      role: m.role === "user" ? "user" : "model",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Gemini API Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Failed to communicate with AI model." });
  }
});

// API: Save missed-call audit request / Lead capture mock storage
const leadDb: any[] = [];
app.post("/api/audit-booking", (req, res) => {
  const { name, company, email, phone, valRange, missedRate, potentialLoss, date, time } = req.body;
  const newLead = {
    id: `lead_${Date.now()}`,
    name,
    company,
    email,
    phone,
    valRange,
    missedRate,
    potentialLoss,
    date,
    time: time || "Not scheduled yet",
    createdAt: new Date().toISOString(),
  };
  leadDb.push(newLead);
  res.status(201).json({ success: true, lead: newLead });
});

app.get("/api/leads", (req, res) => {
  res.json(leadDb);
});

export { app };
