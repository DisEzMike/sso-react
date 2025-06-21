import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/interfaces.ts";
import { signToken } from "../utils/jwt.ts";

export const getUser: any = (req: IRequest, res: Response) => {
    const user = req.user
    const token = req.token

    const grantedScopes = token.scope ? token.scope.split(' ') : [];
    const response: any = { sub: user._id.toString() };

    const scopeMapping: { [key: string]: string[] } = {
      email: ['email'],
      profile: ['displayName', 'preferred_username']
    };

    grantedScopes.forEach(scope => {
      const userField = scopeMapping[scope];
      if (userField && userField.length > 0) {
        userField.forEach((field) => {
          if (field == 'preferred_username') {
              response[field] = user.username
            } 
            else if ((user as any)[field]) {
              response[field] = (user as any)[field]
          }
        })
      }
    });
    
    res.json(response)
}