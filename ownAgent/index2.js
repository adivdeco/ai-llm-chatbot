
const express =require('express')
const app = express();
const main =  require('./AI-chating.js');

app.use(express.json());



app.post('/chat', async (req,res)=>{
    
    const  {message}  = req.body;  
    try {
        const response = await main(message);
        res.send(response);
       }  
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}) 

app.get('/a', (req, res) => {
    res.send('Hello World!');
}
);

app.listen(4000, () => {
    console.log('Server is running on port 3000');
}
);

