import OpenAI from "openai-api";
import prisma from "./prisma";
import { Interface, Source } from "@prisma/client";

// Generates a response to an incoming message.
export async function generateResponse(incoming: string): Promise<string> {
  let client = new OpenAI(process.env.OPENAI_KEY as string);
  let response = await client.complete({
    engine: "text-davinci-001",
    maxTokens: 64,
    topP: 1,
    presencePenalty: 0.6,
    frequencyPenalty: 0.0,
    bestOf: 1,
    n: 1,
    stream: false,
    stop: ["\n"],
    prompt: `The following is a conversation between a human and their "second brain". The brain acts as an intelligent, witty, and comedic AI assistant.

Human: Good morning :)
Brain: Beautiful day eh?
Human: ${incoming}
Brain:`,
  });
  return response.data.choices[0].text.trim();
}

// Responder is a function which can respond to a message.
export type Responder = (msg: string) => Promise<void>;

// Handles an incoming message.
// Note: The request should already be authorized before calling this function.
export async function handleIncoming(
  responder: Responder,
  iface: Interface,
  message: string
): Promise<void> {
  await prisma.message.create({
    data: {
      interface: iface,
      source: Source.User,
      text: message,
    },
  });
  const response = await generateResponse(message);
  await Promise.all([
    responder(response),
    prisma.message.create({
      data: {
        interface: iface,
        source: Source.Brain,
        text: response,
      },
    }),
  ]);
}
