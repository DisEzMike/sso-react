import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/interfaces.ts";
import { generateClientCredentials } from "../utils/cryptoUtils.ts";
import { Client } from "../database/model/Client.ts";

export const createClient: any = async (req: IRequest, res: Response) => {
  try {
  const {redirectUris} = req.body;
  if (!redirectUris || !Array.isArray(redirectUris) || redirectUris.length === 0) {
    return res.status(400).json({ error: 'redirectUris (array) is required' });
  }
  
  const { client_id, client_secret } = generateClientCredentials();
  
    const newClient = new Client({
      client_id,
      client_secret,
      redirectUris,
    });
    await newClient.save();

    res.json({
      client_id,
      client_secret,
      redirectUris,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to create client';
    res.status(500).json({message});
  }
};