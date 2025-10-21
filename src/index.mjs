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

  console.log('Received request:', req.body);

  client.responses.create({
    model: 'gpt-5',
    input: req.body.prompt,
  }).then((response) => {
    console.log('OpenAI response:', response);
    fetch(process.env.ZAPIER_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: req.body.prompt,
        response: response
      })
    })
  })


  res.send('OK')
})

app.get('/', async (req, res) => {
  res.send(process.env)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
