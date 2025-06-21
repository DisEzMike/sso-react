import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/interfaces.ts";
import { signToken } from "../utils/jwt.ts";

export const getUser: any = (req: IRequest, res: Response) => {
    const user = req.user
    const token = req.token

    const grantedScopes = token.scope ? token.scope.split(' ') : [];
    const response: any = { sub: user._id.toString() };

    const scopeMapping: { [key: string]: keyof typeof user } = {
      email: 'email',
      profile: 'displayName'
    };

    grantedScopes.forEach(scope => {
      const userField = scopeMapping[scope];
      if (userField && user[userField]) {
        response[userField] = user[userField];
      }
    });
    
    res.json(response)
}