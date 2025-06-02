
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


// crypto data laane walla function
// 1.

async function getcripto(cripto) {
   const Cryptodata = []

    for (const {name} of cripto){
    const responce = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${name}`);
    const data = await responce.json();
    Cryptodata.push(data)
    }
return Cryptodata;
}
// 2.
// async function getcrypto(cripto) {
//   const cryptodata=[]

//   const responce = await fetch(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=${cripto}`);
//   const data = await responce.json()
//   cryptodata.push(data)
//   return cryptodata;

// }
// getcrypto([{name: "bitcoin"},{name: "ethereum"}])

// chatting function

async function chat() {
    const question = readlineSync.question('Enter name of cripto of which you want to know about: ');
    const today = new Date().toISOString().split('T')[0];
    const prompt = `
    you are a cripto assistant , your only job is to convert the user query into jason format.
    hear user user ask about  cripto by name and you have to convert it into json format.

    the json format should be like this
    {
    "criptodata":true,
    "cripto":[
    {name:"bitcoin"},{name:"ethereum"}
     ]
    }
     I have an api which will give me the data of cripto. after this i send the data to you and 
     you have to write a review on cripto-coin according to the data you get.
     and hear the example of review

     {

     "criptodata":false,
     "data_review":"bitcoin is a digital currency that was created in 2009 by an unknown person using the name Satoshi Nakamoto. 
     now a day its price is around (1000$) , its market cap is (1000000$) and its volume is (10000$)
     or neccesy info that allow you is it good to buy or not today , todays . take date from hear.${today}."
      
     user question :${question}
     donst forgot you only have to respond in json format.
    strictly follow :== or do only what i mention in prompt. dont add and extra example of other coins..
}
  `
 chathistory.push({ role: "user", parts:[{ text:prompt }]})

 while (true) {
    

 let responde = await main();
 responde = responde.trim();
 responde = responde.replace(/^```json\s*|```$/g,'').trim();
 chathistory.push({ role:"assistant", parts:[{ text:responde }]})
 responde = JSON.parse(responde);
 console.log(responde);

 if (responde.criptodata == false) {
    console.log(responde.data_review);
    break;
 }

 const criptodata = await getcripto(responde.cripto); // give data in js obj crypto name.
 const criptodata2 = JSON.stringify(criptodata);   // convert to json format and jSON.parse convert to js object

 chathistory.push({role:"user", parts:[{text:criptodata2}]})

}
}

chat()

