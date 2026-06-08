import {GoogleGenAI} from '@google/genai';
import 'dotenv/config';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});

async function chatBot(req,res) {
  try{
   const {USER_INPUT_TEXT}=req.body;
  let prompt=`Analyze the following patient query and provide a structured assessment.
      in your response No Markdown.
Patient Query: ${USER_INPUT_TEXT}

 JSON Schema:
{{
  "is_emergency": true/false,
  "detected_symptoms": ["list", "of", "extracted", "symptoms"],
  "predicted_condition": "Most likely condition or disease based on symptoms",
  "confidence_level": "High/Medium/Low",
  "recommended_specialist": "Exact type of doctor specialist (e.g., Cardiologist, Dermatologist, General Physician)",
  "next_steps": "Actionable advice, e.g., 'Schedule a non-urgent visit' or 'Go to the ER immediately'",
  "medical_disclaimer": "The official mandatory medical disclaimer text."
}}
`

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt
  });
 // console.log(response.text);
 const text=response.text.replace(/```json|```/g,'').trim()
  res.json(JSON.parse(text))
}
catch(e){
    console.log(e);
    res.status(500).json({"error":"error in generating respose by AI please try again later"})
}
}

export {chatBot};