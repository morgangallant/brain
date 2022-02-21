import type { NextApiRequest, NextApiResponse } from "next";
import { handleIncoming } from "../../../lib/core";
import { Interface } from "@prisma/client";

// TelegramMessage is the type of the Telegram message object.
type TelegramMessage = {
  message: {
    text: string;
    chat: {
      id: number;
    };
    from: {
      username: string;
    };
  };
};

// Ingests and processes incoming Telegram messages.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let message = req.body as TelegramMessage;
  let responder = async (msg: string) => {
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/sendMessage`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: message.message.chat.id,
          text: msg,
        }),
      }
    );
  };
  if (message.message.from.username == process.env.TELEGRAM_USERNAME) {
    await handleIncoming(responder, Interface.Telegram, message.message.text);
  } else {
    await responder("Unauthorized.");
  }
  res.status(200).end();
}
