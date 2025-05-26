

const { GoogleGenAI } = require("@google/genai");
const readlineSync =    require('readline-sync');
 




const ai = new GoogleGenAI({ apiKey: "AIzaSyDZ1B7MxsGkRFZAVXNslGQN3l85-jh85O8" });
const chathistory = [];


async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: chathistory,
  });
  return response.text;
}



//whether laane wall function




async function getweather(location){     // location[{city: "New York", date: 20-10-2002},{city: "New York", date:"today"}]
 
  const Weatherdata = []
   for (const {city,date} of location){

      if(date.toLowerCase()=="today"){

    // const today = new Date().toISOString().split('T')[0];
    const response = await fetch(`http://api.weatherapi.com/v1/current.json?key=dc948cb73c5b4417afd164226252604&q=${city}&aqi=no`);  //&dt={date}
    const data = await response.json();
    Weatherdata.push(data)
    }
    else{
      const response = await fetch(`http://api.weatherapi.com/v1/future.json?key=dc948cb73c5b4417afd164226252604&q=${city}&dt=${date}`);
      const data = await response.json();
      Weatherdata.push(data)
    }

   }
 return Weatherdata;
}



async function weatherdata2(){
const question = readlineSync.question('how i can help you? ');
// const today = new Date().toISOString().split('T')[0];

const prompt = `
You are a weather assistant. You have to provide the weather information.

Strictly follow = "you will only respond to me in JSON format".
Analyze the user query and try to fetch the (city and date) details from it.
Date format should be in (YYYY-MM-DD) format.
If the user asks for today's weather or current weather, then you have to fetch the current date.
If the user asks for a future date, then you have to fetch the future date.
If the user asks for a past date, then you have to fetch the past date.

I have an API to get the weather information.
Your only work is to fetch the data from the input field and provide me the data in JSON format.
JSON format should be like this:
{
  "weather": true,
  "location": [
    {"city": "Bihar", "date": "2023-10-20"},
    {"city": "Assam", "date": "today"}
  ]
}
After this, you will receive weather data. From that, you have to write a review of the weather data.
The review should be in JSON format:

{
  "weather": false,
  "weather_report": "Aaj to mausam bahut achha hai, aaj garmi bhi kam hai, tapman 18 degree hai. Kahin ghoom ke aa jaao. (Use wind speed, humidity, temperature, etc., to make it more professional.)"
}

UserInput:${question};

strictly follow the above format.

 `



chathistory.push({ role: "user", parts:[{ text:prompt }]});



while(true){

let responde = await main();
 responde = responde.trim();
 responde = responde.replace(/^```json\s*|```$/g,'').trim();
chathistory.push({ role: "assistant", parts:[{ text:responde }]});
 responde = JSON.parse(responde);
console.log(responde); // hear we get the data in Js {key:value} format

if(responde.weather==false){
  const weatherReport = responde.weather_report;
  console.log(weatherReport);
  break
}

 const weatherInfo = await getweather(responde.location);
 const weatherInfo2 = JSON.stringify(weatherInfo);
//  console.log(weatherInfo2);
 
 chathistory.push({ role: "user",parts:[{ text:`weather review as per input date :${weatherInfo2}` }]});



}
}

weatherdata2();
