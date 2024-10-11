import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const PORT = 8000;
const app = express();

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEN_AI_KEY);

app.post('/gemini', async (req, res) => {
    console.log(req.body.history);
    console.log(req.body.message);

    let history = req.body.history

    const model = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction:`you are a helpful medical chatbot the user asks questions regarding medical things you should give a neat response 
      if the user asks a question that is outside the medical field you should return a statement like please ask regarding the medical purpose only`

     });

    const chat = model.startChat({
      history: history.map(entry => ({
        role: entry.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: entry.part }]
    }))
    });

    const msg = req.body.message;
    const result = await chat.sendMessage(msg);
    const response = result.response;
    const text = await response.text(); // Added await to handle async properly

    res.send(text);
});

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
