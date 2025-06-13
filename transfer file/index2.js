import player from 'node-wav-player';
import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import wav from 'wav';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: "AIzaSyB0vmU9zScXSTYTuqdTDNkL8gEW4PV05Ps" });
const History = [];

async function saveWaveFile(filename, pcmData, channels = 1, rate = 24000, sampleWidth = 2) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
         channels,
         sampleRate: rate,
         bitDepth: sampleWidth * 8,
      });

      writer.on('finish', () => {
         console.log(`🎧 Voice response saved to ${filename}`);
         resolve();
      });

      writer.on('error', (err) => {
         console.error("Error writing WAV file:", err);
         reject(err);
      });

      writer.write(pcmData);
      writer.end();
   });
}

async function speakText(text, filename = 'out.wav') {
   try {
      const response = await ai.models.generateContent({
         model: "gemini-2.5-flash-preview-tts",
         contents: [{ parts: [{ text }] }],
         config: {
            responseModalities: ['AUDIO'],
            speechConfig: {
               voiceConfig: {
                  prebuiltVoiceConfig: { voiceName: 'Kore' },
               },
            },
         },
      });

      const data = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
      if (!data) {
         console.error("No audio data returned from API.");
         return;
      }

      const audioBuffer = Buffer.from(data, 'base64');
      await saveWaveFile(filename, audioBuffer);  

      await player.play({
         path: filename
      });

   } catch (err) {
      console.error("TTS Error:", err);
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
      systemInstruction: `i would add by own`,
 
    },
   });

   const textReply = response.text;

   History.push({
      role: "model",
      parts: [{ text: textReply }]
   });

   console.log("🤖:", textReply);

   // 👇 Wait for voice generation to finish before continuing
   await speakText(textReply);
}

async function main() {
   while (true) {
      const question = readlineSync.question("You: ");
      await Chatting(question);  // Waits for response + voice file
   }
}

main();
