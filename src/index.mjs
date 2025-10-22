import express from 'express';
import { handleAnalyseMeetingTranscript } from "./prompt.mjs";
import { StatusError } from './utils.mjs';

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

  if (!req.body.promptName) {
    return res.status(400).send({
      error: 'promptName is required'
    });
  }

  console.log('Received request:', req.body);

  try {
    switch (req.body.promptName) {
      case 'analyse-meeting-transcript':
        await handleAnalyseMeetingTranscript(req)
        break;
      default:
        res.status(400).send({
          error: 'Unknown promptName'
        });
        return;
    }
  } catch (error) {
    console.error('Error handling request:', error);
    res.status(error instanceof StatusError ? error.status : 500).send({
      error: error.message
    });
    return;
  }

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
