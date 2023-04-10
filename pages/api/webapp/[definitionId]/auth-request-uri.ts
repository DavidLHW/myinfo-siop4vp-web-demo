import { NextApiRequest, NextApiResponse } from "next";
import { handleAuthRequestURI } from "../../../lib/restApiHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "GET") {
    await handleAuthRequestURI(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
