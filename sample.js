import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import fs from 'fs';
import { type } from "os";
import path from 'path';

const token = process.env["GITHUB_TOKEN"];
const endpoint = "https://models.github.ai/inference";
const model = "microsoft/Phi-4-multimodal-instruct";

export async function main() {
  const imagePath = path.join(process.cwd(), "contoso_layout_sketch_small.jpeg"); // hard-coded path to the image file

  try {
    const imageBuffer = fs.readFileSync(imagePath);
    const imageBase64 = imageBuffer.toString('base64');
    const imageDataUri = `data:image/jpeg;base64,${imageBase64}`; // Assuming JPEG, adjust if needed

    const client = ModelClient(
      endpoint,
      new AzureKeyCredential(token),
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          { role: "system", content: "You are a helpful assistant that can generate HTML and CSS code from a hand-drawn sketch of a webpage layout." },
          { role: "user", content: [
            { type: "text", text: "Please analyze the following hand-drawn sketch and generate the corresponding HTML and CSS code for a web page layout." },
            { type: "image", image: { data: imageDataUri } }
            ] 
        }
        ],
        temperature: 0.7,
        top_p: 1.0,
        max_tokens: 2000,
        model: model
      }
    });

    if (isUnexpected(response)) {
      throw response.body.error;
    }

    console.log(response.body.choices[0].message.content);
  } catch (err) {
    console.error("The sample encountered an error:", err);
  }
}

main();

