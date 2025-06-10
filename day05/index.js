// model which gives que output


import { GoogleGenAI } from "@google/genai";
import readlineSync from 'readline-sync';


const ai = new GoogleGenAI({ apiKey: "AIzaSyDZ1B7MxsGkRFZAVXNslGQN3l85-jh85O8" });

const History = []

async function Chatting(question) {

   History.push({
    role: "user", 
    parts: [{ text: question }]
 });

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: History,
  });

 
     History.push({
        role: "model", 
        parts: [{ text: response.text}] 
    });

     console.log(response.text);
   
}

async function  main() {

    const question = readlineSync.question("Ask a question: ");
    await Chatting(question);
    main();
}

main()







// const ai = new GoogleGenAI(
//   { apiKey: "AIzaSyDZ1B7MxsGkRFZAVXNslGQN3l85-jh85O8" });

//   const chat = ai.chats.create({
//     model: "gemini-2.0-flash",
//   });
  
//   const history = [];

// async function main() {
//   const question = readlineSync.question("You: ");
//   history.push({ role: "user", parts: [{ text: question }] });

//   const response = await chat.sendMessage({
//     history,
//     message: question,
//   });

//   console.log("AI:", response.text);

//   history.push({ role: "model", parts: [{ text: response.text }] });

//   await main(); // continue the loop
// }



// await main();