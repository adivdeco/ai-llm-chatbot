// import say from 'say';

// async function speakText(text) {
//    say.speak(text);
// }

// speakText("mujhe aaje teen gulabjaamun khana ko millaa")


import say from 'say';

async function speakText(text) {
   say.speak(text);
}

// Example: some function that might throw
async function riskyFunction() {
   // Simulating an error
   throw new Error("File not found yaaar 💥☠️🗿🥹😙🥸😶😶‍🌫️😵‍💫");
}

// Error-handling wrapper
(async () => {
   try {
      await riskyFunction();
   } catch (err) {
      const errorMessage = `Error hua: ${err.message}`;
      console.error(errorMessage); // Still show in console
      await speakText(errorMessage); // Speak the error
   }
})();
