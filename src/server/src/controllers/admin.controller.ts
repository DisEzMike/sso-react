import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/type.ts";
import { generateClientCredentials } from "../utils/cryptoUtils.ts";

export const createClient: any = (req: IRequest, res: Response) => {
  const { redirectUris } = req.body;
  if (!redirectUris || !Array.isArray(redirectUris) || redirectUris.length === 0) {
    return res.status(400).json({ error: 'redirectUris (array) is required' });
  }

  const { clientId, clientSecret } = generateClientCredentials();

  try {
    // const newClient = await Client.create({
    //   clientId,
    //   clientSecret,
    //   redirectUris,
    // });

    res.json({
      clientId: clientId,
      clientSecret: clientSecret,
      redirectUris: redirectUris,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create client' });
  }
};