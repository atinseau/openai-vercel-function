import express from 'express';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express()
const port = 3000

app.use(express.json());

app.post('/', async (req, res) => {
  const internalApiKey = req.headers['internal-api-key']
  if (internalApiKey !== process.env.INTERNAL_API_KEY) {
    return res.status(401).send({
      error: 'Unauthorized'
    });
  }
  const response = await client.responses.create({
    model: 'gpt-4o',
    input: req.body.prompt,
  });
  res.send(response)
})

app.get('/', async (req, res) => {
  res.send(process.env)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
