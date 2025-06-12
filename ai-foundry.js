import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";
import dotenv from 'dotenv';

dotenv.config();

const client = new ModelClient(
  process.env.AZURE_INFERENCE_SDK_ENDPOINT, new AzureKeyCredential(process.env.AZURE_INFERENCE_SDK_KEY)
);

var messages = [
  { role: "system", content: "You are an helpful assistant" },
  { role: "user", content: "What are 3 things to see in Seattle?" },
];

var response = await client.path("chat/completions").post({
  body: {
    messages: messages,
    max_tokens: 2048,
      temperature: 0.8,
      top_p: 0.1,
      presence_penalty: 0,
      frequency_penalty: 0,
      model: "Llama-4-Maverick-17B-128E-Instruct-FP8",
  },
});

// console.log(JSON.stringify(response));
console.log(response.body.choices[0].message.content);
