import type { NextApiRequest, NextApiResponse } from 'next'

/*
    Ingests and processes incoming Telegram messages.
*/
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
    console.log(JSON.stringify(req.body, null, 2));
    res.status(200);
}
