import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/type.ts";
import { generateClientCredentials } from "../utils/cryptoUtils.ts";

export const createClient: any = (req: IRequest, res: Response) => {
  try {
  const {redirectUris} = req.body;
  if (!redirectUris || !Array.isArray(redirectUris) || redirectUris.length === 0) {
    return res.status(400).json({ error: 'redirectUris (array) is required' });
  }
  
  const { clientId, clientSecret } = generateClientCredentials();
  
    const newClient = await Client.create({
      clientId,
      clientSecret,
      redirectUris,
    });

    res.json({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUris: redirectUris,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create client';
    res.status(500).json({message});
  }
};