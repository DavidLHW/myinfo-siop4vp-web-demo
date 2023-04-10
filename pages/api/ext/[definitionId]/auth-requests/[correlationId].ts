import { NextApiRequest, NextApiResponse } from "next";
import { handleExtAuthRequests } from "../../../../lib/restApiHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    await handleExtAuthRequests(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
