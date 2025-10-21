import express from 'express';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express()
const port = 3000

app.post('/', (req, res) => {
  console.log(req.body)
  res.send('Hello World!')
})

app.get('/', async (req, res) => {
  console.log(req.body)
  const response = await client.responses.create({
    model: 'gpt-4o',
    instructions: 'You are a coding assistant that talks like a pirate',
    input: 'Are semicolons optional in JavaScript?',
  });
  res.send(response)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
