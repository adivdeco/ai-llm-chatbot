
const express =require('express')
const app = express();
const main =  require('./AI-chating.js');

app.use(express.json());

const history = {};  // Object to store chat history for each user

app.post('/chat', async (req,res)=>{
    
    const  {message,id}  = req.body;  

    if(!history[id]){
        history[id] = [];    // Initialize history for new user
    }
     
    const chatHistory = history[id];  // Get chat history for the user

    const history_current_msg = [...chatHistory,{
        role:'user',                                   // hear u add chat history or current msg in { history_current_msg }
        parts:[{text:message}]
    }] 
    
    // try {
        const response = await main(history_current_msg);
        chatHistory.push({role: 'user',parts:[{text: message}]});  // Store the user msg in chat history
        chatHistory.push({role: 'model',parts:[{text: response}]});  // Store the assistant's response in chat history

        res.send(response);
    //    }  
    // catch (error) {
    //     console.error(error);
    //     res.status(500).json({ error: 'Internal Server Error' });
    // }
}) 
 


app.listen(4000, () => {
    console.log('Server is running on port 3000');
}
);

