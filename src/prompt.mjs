import OpenAI from 'openai';
import { getPrompt, StatusError } from "./utils.mjs";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 *
 * @param {import('express').Express} req
 */
export async function handleAnalyseMeetingTranscript(req) {

  const promptName = req.body.promptName;
  const prompt = getPrompt(promptName)

  const transcript = req.body.transcript
  if (!transcript) {
    throw new StatusError(400, 'transcript is required in the request body')
  }

  const existingIdeas = req.body.existingIdeas
  if (!existingIdeas) {
    throw new StatusError(400, 'existingIdeas is required in the request body')
  }

  const customizedPrompt = prompt
    .replace('{{TRANSCRIPT}}', JSON.stringify(transcript))
    .replace('{{EXISTING_IDEAS}}', JSON.stringify(existingIdeas))

  console.log('Customized prompt:', customizedPrompt);

  client.chat.completions.create({
    model: 'gpt-5',
    service_tier: "priority",
    stream: false,
    response_format: {
      type: "json_object"
    },
    messages: [
      { role: 'user', content: customizedPrompt }
    ]
  })
    .then((response) => {
      const message = response.choices[0].message.content
      console.log('OpenAI message:', message);

      if (process.env.NODE_ENV === "local") {
        return
      }
      fetch(process.env.ZAPIER_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: req?.body?.metadata || {},
          message
        })
      })
    })
    .catch((error) => {
      console.error('Error from OpenAI:', error);
    });

}
