import {GoogleGenAI} from '@google/genai';
import wav from 'wav';

async function saveWaveFile(
   filename,
   pcmData,
   channels = 1,
   rate = 24000,
   sampleWidth = 2,
) {
   return new Promise((resolve, reject) => {
      const writer = new wav.FileWriter(filename, {
            channels,
            sampleRate: rate,
            bitDepth: sampleWidth * 8,
      });

      writer.on('finish', resolve);
      writer.on('error', reject);

      writer.write(pcmData);
      writer.end();
   });
}

async function main() {
   const ai = new GoogleGenAI({ apiKey: "AIzaSyDZ1B7MxsGkRFZAVXNslGQN3l85-jh85O8" });

 try{ 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: 'Say poilitly: iam adiv , whats your name. and what you like to do in free time' }] }],
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

   const fileName = 'out.wav';
   await saveWaveFile(fileName, audioBuffer);
   console.log(`Audio saved to ${fileName}`);

} catch(err){
   console.log("Error: ",err);
   
}
}
await main();