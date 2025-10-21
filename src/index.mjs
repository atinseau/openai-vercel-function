import express from 'express';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express()
const port = 3000

app.post('/', async (req, res) => {
  console.log(req.headers)
  const internalApiKey = req.headers['internal-api-key']
  if (internalApiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).send({
      error: 'Unauthorized'
    });
  }

  console.log('body', req.body)

  const response = await client.responses.create({
    model: 'gpt-4o',
    instructions: 'You are a coding assistant that talks like a pirate',
    input: 'Are semicolons optional in JavaScript?',
  });
  res.send(response)
})

app.get('/', async (req, res) => {
  res.send(process.env)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
