import { NextApiRequest, NextApiResponse } from "next";
import { handleExtAuthResponses } from "../../../lib/restApiHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    await handleExtAuthResponses(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
