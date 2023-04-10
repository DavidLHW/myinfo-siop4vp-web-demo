import { NextApiRequest, NextApiResponse } from 'next';
import { handleAuthStatus } from '../../../lib/restApiHandler';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    await handleAuthStatus(req, res);
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
