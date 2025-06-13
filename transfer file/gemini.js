// gemini.js

const GEMINI_API_KEY = 'YOUR_API_KEY';
const systemInstructionText = `i will ad by my own`;
const History = [];

export async function chatWithGemini(userInput) {
    History.push({ role: 'user', parts: [{ text: userInput }] });

    const chatResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: History,
            systemInstruction: { parts: [{ text: systemInstructionText }] },
            generationConfig: { temperature: 0.8, maxOutputTokens: 800 }
        })
    });

    const chatData = await chatResponse.json();
    const botText = chatData?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I didn't get that.";

    History.push({ role: 'model', parts: [{ text: botText }] });
    if (History.length > 20) History.splice(0, History.length - 20);

    return botText;
}

export async function getTTS(text) {
    const ttsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text }] }],
            generationConfig: { responseModalities: ['AUDIO'] },
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' }
                }
            }
        })
    });

    const data = await ttsResponse.json();
    return data?.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
}
