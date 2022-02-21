import type { NextApiRequest, NextApiResponse } from "next";

// Health check endpoint.
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.status(200).end();
}
