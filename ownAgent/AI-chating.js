
const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({ apiKey: "AIzaSyDZ1B7MxsGkRFZAVXNslGQN3l85-jh85O8" });

async function main(message) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: message,
  });
  // console.log(response);
  // console.log(response.text);  
  return response.text;
}


 module.exports = main;