import { RequestHandler } from "express";
import { googleProfile, loginType } from "../utils/type.js";
import axios from "axios";
import jwt from "jsonwebtoken";
import { ProviderUser } from "../database/model/ProviderUser.ts";
import { User } from "../database/model/User.ts";

export const loginRoute: RequestHandler = async (req, res) => {

    if (!req.body) res.status(403).json({status: 403, message: "body not provide."});
    else {
        const {body} = req;
    
        const {type, data} = body as loginType;
    
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

                let payload = {type, data: response.data as googleProfile};
                const providerUser = await ProviderUser.findOneAndUpdate({providerId: payload.data.id});
                let user;
                if (providerUser) {
                    user = await User.findByIdAndUpdate(providerUser.userId, {new: true}); 
                } else {
                    const new_providerUser = new ProviderUser({
                        type: payload.type,
                        providerId: payload.data.id,
                        data: payload.data
                    })
                    await new_providerUser.save();

                    user = await User.findByIdAndUpdate(new_providerUser.userId, {new: true}); 
                }

                payload = {user} as any;
                jwt.sign(payload, process.env.JWT_SECRET!, {expiresIn: "1d"}, (error, token) => {
                    if (error) throw error;
                    res.cookie("sso_token", token, {
                        domain: '.mikenatcavon.com',
                        path: '/',
                        httpOnly: true,
                        secure: true,
                        maxAge: 24 * 60 * 60 * 1000
                    })
                    res.json({payload, token});
                });
            } catch (error) {
                console.log(error)
            }

        } else if (type == "line") {
            res.status(404).json({status: 404, message: "Local login is not active"});
        } else {
            res.status(404).json({status: 403, message: "type is not provide"});
        }
    }
}