import { Request, RequestHandler, Response } from "express";
import { authCode, googleProfile, loginType } from "../utils/type.ts";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ProviderUser } from "../database/model/ProviderUser.ts";
import { IUser, User } from "../database/model/User.ts";
import { createToken, getToken } from "../utils/auth.ts";
import { AuthCode } from "../database/model/AuthCode.ts";
import { generateCode } from "../utils/cryptoUtils.ts";
import moment from "moment";
import { Client } from "../database/model/Client.ts";
import { HOST } from "../utils/contant.ts";

export const authorize: any = async (req: Request, res: Response) => {

    if (!req.body) res.status(403).json({status: 403, message: "body not provide."});
    else {
        const {body} = req;
    
        const {type, data} = body as loginType;

        const client = await Client.findOne({ client_id: data.client_id });
            if (!client || !client.redirectUris.includes(data.redirect_uri)) {
            return res.status(400).send('Invalid client or redirect URI');
        }
    
        if (type == "local") {
            res.status(404).json({status: 404, message: "Local login is not active"});
        } else if (type == "google") {
            try {    
                const response = await axios.get("https://www.googleapis.com/oauth2/v1/userinfo?alt=json", {
                    headers: {
                        Authorization: `Bearer ${data.access_token}`
                    }
                });
                const profile = response.data as googleProfile
                const authData = {type, profile};
                const providerUser = await ProviderUser.findOneAndUpdate({providerId: authData.profile.id});
                let user;
                if (providerUser) {
                    user = await User.findByIdAndUpdate(providerUser.userId, {new: true}); 
                } else {
                    const new_providerUser = new ProviderUser({
                        type: authData.type,
                        providerId: authData.profile.id,
                        data: authData.profile
                    })
                    await new_providerUser.save();

                    user = await User.findByIdAndUpdate(new_providerUser.userId, {new: true}); 
                }

                const authCode = new AuthCode({
                    code: generateCode(),
                    client_id: data.client_id,
                    user_id: user!._id,
                    redirect_uri: data.redirect_uri,
                    expiresAt: moment().add(1, 'd')
                })
                authCode.save();

                res.json({redirect_url: `${data.redirect_uri}?code=${authCode.code}&state=${data.state}`});
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
    const { grant_type } = req.body;
    if (grant_type == 'authorization_code') {
        try {
        const { code, client_id, client_secret, redirect_uri } = req.body;
        
        const client = await Client.findOne({ client_id: client_id });
        if (!client || client.client_secret !== client_secret) {
            return res.status(401).send('Invalid client credentials');
        }
        
        const authCode = await AuthCode.findOne({ code, client_id: client_id, redirect_uri: redirect_uri });
        if (!authCode || moment(authCode.expiresAt).isAfter(moment())) {
            return res.status(400).send('Invalid or expired authorization code');
        }

        const user = await User.findByIdAndUpdate(authCode?.user_id, {new:true});
        const access_token = createToken({user});

        const idTokenPayload = {
            iss: HOST,
            sub: user!._id.toString(),
            aud: client_id,
            email: user!.email,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        };
        const idToken = createToken(idTokenPayload);

        // Generate Refresh Token
        // const refreshTokenValue = randomBytes(40).toString('hex');
        // const refreshTokenExpiry = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

        // await RefreshToken.create({
        //     token: refreshTokenValue,
        //     userId: user._id,
        //     clientId: client_id,
        //     expiresAt: refreshTokenExpiry,
        // });

        await AuthCode.deleteOne({ code });
        res.json({
            access_token,
            token_type: 'Bearer',
            expires_in: 24 * 60 * 60,
            id_token: idToken,
            // refresh_token: refreshTokenValue,
        });
        } catch (error) {
            console.error(error)
            return res.status(403).json({error: 403, message: "Token is expired"})
        }
    } else {
        return res.status(400).json({ error: 'Unsupported grant type' });
    }
}