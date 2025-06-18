import { Request, RequestHandler, Response } from "express";
import { authCode, googleProfile, loginType } from "../utils/type.ts";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ProviderUser } from "../database/model/ProviderUser.ts";
import { IUser, User } from "../database/model/User.ts";
import { getToken } from "../utils/auth.ts";

export const authorize: RequestHandler = async (req, res) => {

    if (!req.body) res.status(403).json({status: 403, message: "body not provide."});
    else {
        const {body} = req;
    
        const {type, data} = body as any;
    
        if (type == "local") {
            res.status(404).json({status: 404, message: "Local login is not active"});
        } else if (type == "google") {
            try {
                const tokenResponse = data;
    
                const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    }
                });
                const autoData = {type, data: response.data as googleProfile};
                const providerUser = await ProviderUser.findOneAndUpdate({providerId: autoData.data.id});
                let user;
                if (providerUser) {
                    user = await User.findByIdAndUpdate(providerUser.userId, {new: true}); 
                } else {
                    const new_providerUser = new ProviderUser({
                        type: autoData.type,
                        providerId: autoData.data.id,
                        data: autoData.data
                    })
                    await new_providerUser.save();

                    user = await User.findByIdAndUpdate(new_providerUser.userId, {new: true}); 
                }

                const payload = {user_id: user!.id, client_id: data.client_id} as authCode;
                jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "1d"}, (error, token) => {
                    if (error) throw error;
                    // res.cookie("sso_token", token, {
                    //     domain: '.mikenatcavon.com',
                    //     path: '/',
                    //     httpOnly: true,
                    //     secure: true,
                    //     maxAge: 24 * 60 * 60 * 1000
                    // })
                    res.json({redirect_url: `${data.redirect_uri}?code=${token}&state=${data.state}`});
                });
            } catch (error) {
                console.log(error);
            }

        } else if (type == "line") {
            res.status(404).json({status: 404, message: "Local login is not active"});
        } else {
            res.status(404).json({status: 403, message: "type is not provide"});
        }
    }
}

export const token: any = async (req: Request, res: Response) => {
    const { code, client_id, client_secret, redirect_uri, grant_type } = req.body;

    if (grant_type !== 'authorization_code') return res.status(400).json({ error: 'Unsupported grant type' });

    try {
        const payload = await getToken(code);
        return res.json(payload);
    } catch (error) {
        console.error(error)
        return res.status(403).json({error: 403, message: "Token is expired"})
    }
}

export const me: any = async (req: Request, res: Response) => {
  res.setHeader('Content-Type', 'application/json');

  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];


  // Assuming you have JWT verification
  jwt.verify(token!, 'tIsEfhpwQv4mAbqHtwnAyP8wKubzRPFr', (err, data) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }

    const user = (data as any).user as IUser


    const response = {
      displayName: user.displayName, // Must exist
      email: user.email,
      role: user.role // Or 2 for regular users
    };

    res.json(response);
  });
}