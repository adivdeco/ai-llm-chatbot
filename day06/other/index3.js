import axios from 'axios';
import fs from 'fs';
import readlineSync from 'readline-sync';
import player from 'node-wav-player';
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = 'AIzaSyB0vmU9zScXSTYTuqdTDNkL8gEW4PV05Ps';
const ELEVEN_API_KEY = 'sk_a3579cdb3df76ab3968e7108ada0d264bed3e1f64dad1187';
const ELEVEN_VOICE_ID = 'EXAVITQu4vr4xnSDxMaL'; // You can replace with your preferred voice ID

const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const History = [];

async function speakText(text, filename = 'out.mp3') {
   try {
      const response = await axios.post(
         `https://api.elevenlabs.io/v1/text-to-speech/${ELEVEN_VOICE_ID}`,
         {
            text: text,
            model_id: "eleven_monolingual_v1",
            voice_settings: {
               stability: 0.5,
               similarity_boost: 0.75,
            },
         },
         {
            headers: {
               'xi-api-key': ELEVEN_API_KEY,
               'Content-Type': 'application/json',
               'Accept': 'audio/mpeg',
            },
            responseType: 'arraybuffer',
         }
      );

      fs.writeFileSync(filename, response.data);
      console.log(`🎧 Voice response saved to ${filename}`);

      await player.play({ path: filename });
   } catch (err) {
      console.error("TTS Error:", err.message);
   }
}

async function Chatting(question) {
   History.push({
      role: "user",
      parts: [{ text: question }]
   });

   const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: History,
      config: {
         systemInstruction: `
You are "CodeBot by Coder Army " – an AI mentor that explains **coding concepts from absolute basics** in Rohit Negi's style.
Follow these rules:

1. Plain-language definition
2. Analogy if needed
3. Mathematical expression
4. 3-Funda breakdown
5. Time/space complexity
6. Use Hinglish and energetic tone
7. Use phrases like: "clear?", "chamka?", "popcorn khane aaye ho kya?"

If the user asks non-coding questions, reply rudely like Rohit Negi.
         `
      }
   });

   const textReply = response.text;
   History.push({
      role: "model",
      parts: [{ text: textReply }]
   });

   console.log("🤖:", textReply);
   await speakText(textReply);
}

async function main() {
   while (true) {
      const question = readlineSync.question("You: ");
      await Chatting(question);
   }
}

main();
