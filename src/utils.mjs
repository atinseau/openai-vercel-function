import { readFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

/**
 *
 * @param {string} promptName
 * @returns
 */
export function getPrompt(promptName) {
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const promptPath = join(__dirname, 'prompts', `${promptName}.prompt.md`);
  const prompt = readFileSync(promptPath, 'utf-8');

  return prompt
}


export class StatusError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
