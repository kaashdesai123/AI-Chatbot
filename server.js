const express = require('express');
const bodyParser = require('body-parser');
const chatbot = require('./bot');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome to the AI Chatbot! Send a POST request to /chat to communicate with the bot.');
});

app.post('/chat', (req, res) => {
    const userMessage = req.body.message;
    // For this basic version, we just assign 0 if message includes "hello" and 1 if it includes "bye"
    const pattern = userMessage.toLowerCase().includes("hello") ? 0 : 1;
    const botResponse = chatbot.talk(pattern);
    res.send({ response: botResponse });
});

const PORT = 3000;
app.listen(PORT, async () => {
    await chatbot.train();
    console.log(`Server started on http://localhost:${PORT}`);
});
