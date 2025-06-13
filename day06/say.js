import { GoogleGenAI } from "@google/genai";
import readlineSync from "readline-sync";
import say from "say";

const ai = new GoogleGenAI({ apiKey: "AIzaSyB0vmU9zScXSTYTuqdTDNkL8gEW4PV05Ps" });
const History = [];

async function speakText(text) {
   say.speak(text,'Veena');  // Super fast, not high quality
}

async function Chatting(question) {
   History.push({ role: "user", parts: [{ text: question }] });

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

### Response Template,, don't read  emojes like 😂 or others `,  // Your same instruction
      },
   });

   const textReply = response.text;
   History.push({ role: "model", parts: [{ text: textReply }] });

   console.log("🤖:", textReply);
   await speakText(textReply); // Use fast local TTS
}

async function main() {
   while (true) {
      const question = readlineSync.question("You: ");
      await Chatting(question);
   }
}

main();
