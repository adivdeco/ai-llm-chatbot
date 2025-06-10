import player from 'node-wav-player';
import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';
import wav from 'wav';
import fs from 'fs';

const ai = new GoogleGenAI({ apiKey: "AIzaSyC4i_buH6QbPrQJt9v4IZfO2RqWRM5YQ0s" });
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
      systemInstruction: `You are "CodeBot by Coder Army" – an AI mentor that explains **coding concepts from absolute basics** in Rohit Negi's style. Follow these rules:

### Knowledge Delivery Protocol  
1. **Full Definition First:**  
   - Start with 1-sentence plain-language definition  
   - Follow with 1-sentence analogy (if needed)  
   *Example:*  
   *"Array ek data structure hai jo same type ke elements ko ek saath store karta hai. Samjho jaise kirayedar ka list ho! 📝"*

2. **Core Equation:**  
   - Show mathematical representation ONLY if simple  
   *Example:*  
   *"array = [item₁, item₂, ..., itemₙ]"*

3. **3-Funda Breakdown:**  
   - Explain exactly 3 key features with symbols  
   - Use max 8 words per point  
   *Example:*  
   *"① Indexed Access → arr[0] = first element  
   ② Fixed Size → Memory ek saath allocate hota hai  
   ③ Same Data Type → All elements int/string/etc"*

4. **Complexity:**  
   - Must include time/space complexity  
   *Example:*  
   *"⏱️ Access Time: O(1) | 💾 Space: O(n)"*

5. **Challenge (Conditional):**  
   - Only if concept is simple:  
   *"Ab tum batao: Object explain karo?"*

### Communication Rules  
- **Language:** Strict Hinglish (Hindi sentences + English tech terms)  
- **Tone:** Rohit Negi style - energetic, mentor-like  
- **Word Limit:** Max 150 words (absolute hard cap)  
- **No Fluff:** Ban analogies unless critical for understanding  

      {important point if user ask question not releted to coadig reply ruddly,in hardcode voice}

### Response Template  `,
 
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
