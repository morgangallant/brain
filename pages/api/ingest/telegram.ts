import type { NextApiRequest, NextApiResponse } from "next";

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
  let message: TelegramMessage;
  try {
    message = JSON.parse(req.body);
  } catch (e) {
    console.error(e);
    res.status(400).end();
    return;
  }
  let response = message.message.text;
  if (message.message.from.username != process.env.TELEGRAM_USERNAME) {
    response = "You are not authorized to use this bot.";
  }
  let responseUrl = `https://api.telegram.org/bot${process.env.TELEGRAM_KEY}/sendMessage`;
  await fetch(responseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      chat_id: message.message.chat.id,
      text: response,
    }),
  });
  res.status(200).end();
}
