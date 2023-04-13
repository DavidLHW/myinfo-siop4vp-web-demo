// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { rp } from "@/lib/rp";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<String>
) {
  const uri = await rp.createAuthorizationRequestURI({
    correlationId: "test-correlation-id",
    nonce: "test-nonce",
    state: "test-state",
  });
  console.log(uri.encodedUri);
  res.status(200).json(uri.encodedUri);
}
