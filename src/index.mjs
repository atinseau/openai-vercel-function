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

  client.chat.completions.create({
    model: 'gpt-4.1',
    service_tier: "priority",
    stream: false,
    response_format: {
      type: "text"
    },
    messages: [
      { role: 'user', content: req.body.prompt }
    ]
  })
    .then((response) => {
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
    .catch((error) => {
      console.error('Error from OpenAI:', error);
    });


  res.send('OK')
})

app.get('/', async (req, res) => {
  res.send(process.env)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

setInterval(() => {
  console.log('Keeping the server alive...')
}, 1000)
