import { NextApiRequest, NextApiResponse } from "next";
import { handleAuthRequests } from "../../../lib/restApiHandler";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "DELETE") {
    await handleAuthRequests(req, res);
  } else {
    res.status(405).json({ message: "Method Not Allowed" });
  }
};
