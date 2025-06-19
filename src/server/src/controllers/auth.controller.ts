import { Request, RequestHandler, Response } from "express";
import { authCode, googleProfile, loginType } from "../utils/interfaces.ts";
import axios from "axios";
import { ProviderUser } from "../database/model/ProviderUser.ts";
import { IUser, User } from "../database/model/User.ts";
import { createToken, getAuthCode, getToken } from "../utils/auth.ts";
import { AuthCode } from "../database/model/AuthCode.ts";
import { generateCode } from "../utils/cryptoUtils.ts";
import moment from "moment";
import { Client } from "../database/model/Client.ts";
import { HOST } from "../utils/contant.ts";
import { randomBytes } from "crypto";
import { RefreshToken } from "../database/model/RefreshToken.ts";
import bcrypt from 'bcrypt';
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
            const {username, password} = data;
            const user = await User.findOneAndUpdate({username}, {new:true});
            if (!user) return res.status(401).json({status: 401, message: "user not found"});

            const validPassword = await bcrypt.compare(password, user.password);
            if (!validPassword) return res.status(401).json({status: 401, message: "password not match"});

            const authCode = await getAuthCode({
                client_id: data.client_id,
                user_id: user!._id,
                redirect_uri: data.redirect_uri,
            })

            res.json({redirect_url: `${data.redirect_uri}?code=${authCode.code}&state=${data.state}`});
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

                const authCode = await getAuthCode({
                    client_id: data.client_id,
                    user_id: user!._id,
                    redirect_uri: data.redirect_uri,
                })

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
        
        const client = await Client.findOne({ client_id });
        if (!client || client.client_secret !== client_secret) {
            return res.status(401).send('Invalid client credentials');
        }
        
        const authCode = await AuthCode.findOne({ code, client_id, redirect_uri });
        if (!authCode || moment().isAfter(authCode.expiresAt)) {
            return res.status(400).send('Invalid or expired authorization code');
        }

        const user = await User.findByIdAndUpdate(authCode?.user_id, {new:true});
        const payload = {user}
        const access_token = createToken({payload});

        const idTokenPayload = {
            iss: HOST + "/oauth",
            sub: user!._id.toString(),
            aud: client_id,
            email: user!.email
        };
        const idToken = createToken(idTokenPayload);
        
        // Generate Refresh Token
        const refresh_token = randomBytes(40).toString('hex');
        const refreshTokenExpiry = moment().add(1, 'month');

        await RefreshToken.create({
            token: refresh_token,
            userId: user!._id,
            clientId: client_id,
            expiresAt: refreshTokenExpiry,
        });

        await AuthCode.deleteOne({ code });
        res.json({
            access_token,
            token_type: 'Bearer',
            expires_in: 24 * 60 * 60,
            id_token: idToken,
            refresh_token,
        });
        } catch (error) {
            console.error(error)
            return res.status(403).json({error: 403, message: "Token is expired"})
        }
    } else if (grant_type == 'refresh_token') {
        const { refresh_token, client_id, client_secret } = req.body;

        const client = await Client.findOne({ client_id });
        if (!client || client.client_secret !== client_secret) {
            return res.status(401).send('Invalid client credentials');
        }

        const savedToken = await RefreshToken.findOneAndUpdate({ token: refresh_token, client_id });
            if (!savedToken || moment().isAfter(savedToken.expiresAt)) {
            return res.status(400).send('Invalid or expired refresh token');
        }

        const user = await User.findByIdAndUpdate(savedToken.user_id, {new: true});
        const payload = {user}
        const access_token = createToken({payload});

        const idTokenPayload = {
            iss: HOST + "/oauth",
            sub: user!._id.toString(),
            aud: client_id,
            email: user!.email
        };
        const idToken = createToken(idTokenPayload);

        await RefreshToken.deleteOne({ token: refresh_token });

        const newRefreshTokenValue = randomBytes(40).toString('hex');
        const refreshTokenExpiry = moment().add(1, 'month');

        await RefreshToken.create({
            token: newRefreshTokenValue,
            userId: user!._id,
            clientId: client_id,
            expiresAt: refreshTokenExpiry,
        });

        res.json({
            access_token,
            token_type: 'Bearer',
            expires_in: 3600,
            id_token: idToken,
            refresh_token: newRefreshTokenValue,
        });
    } else {
        return res.status(400).json({ error: 'Unsupported grant type' });
    }
}

export const discovery = (req: Request, res: Response) => {
  res.json({
    issuer: HOST + '/oauth',
    authorization_endpoint: `${HOST}`,
    token_endpoint: `${HOST}/oauth/token`,
    userinfo_endpoint: `${HOST}/api/me`,
    response_types_supported: ['code'],
    subject_types_supported: ['public'],
    id_token_signing_alg_values_supported: ['HS256'],
    scopes_supported: ['openid', 'profile', 'email'],
    token_endpoint_auth_methods_supported: ['client_secret_post'],
  });
};

export const register: any = async (req: Request, res: Response) => {
    try {
        const {username, password, email} = req.body;
        const salt = bcrypt.genSaltSync(10);
        const hashPassword = bcrypt.hashSync(password, salt);

        const newUser = new User({
            username, 
            displayName: username, 
            password: hashPassword, 
            email: email
        });
        await newUser.save();

        return res.status(201).json({ status: 201, message: "user created!" });
    } catch (error) {
        const message = error instanceof Error ? error.message : "Unable to register";
        return res.status(500).json({status: 500, message});
    }
}