import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IRequest } from "../utils/interfaces.ts";
import { IUser, User } from "../database/model/User.ts";
import { getAuthCode, getToken } from "../utils/auth.ts";
import { LOCAL_CLIENT_ID } from "../../../client/utils/contant.ts";
import { HOST } from "../utils/contant.ts";

export const ssoAuth: any = async (req: IRequest, res: Response) => {
    try {
        const cookieHeader = req.headers['cookie']
        if (!cookieHeader) return res.status(401).json({status: 401, message: "Unauthrized"});

        let {client_id, redirect_uri, state} = req.body;
        const sso_token = cookieHeader && cookieHeader.split('=')[1];
        const data = jwt.verify(sso_token, process.env.JWT_SECRET!) as any;
        const user = data.user;
        const authCode = await getAuthCode({
            client_id: client_id,
            user_id: user!._id,
            redirect_uri: redirect_uri,
        })
        
        res.json({redirect_url: `${authCode.redirect_uri}?code=${authCode.code}&state=${state}`});
    } catch (error) {
        console.error(error);
        res.send('Token Invalid').status(500)
    }
}

export const authMiddleware:any = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        //code
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({status: 401, message: 'Missing Authorization header'});
        const token = authHeader && authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            const {payload} = decoded;
    
            const user = await User.findByIdAndUpdate<IUser>(payload.user._id, {new: true});
            req.user = user!;
                    
            next();
        } catch (error) {
            res.status(401).json({status: 401, message: 'Invalid access token'});
        }

    } catch (err) {
        // err
        console.error(err)
        res.send('Token Invalid').status(500)
    }
}


export const checkAdmin:any = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        //code
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({status: 401, message: 'Missing Authorization header'});
        const token = authHeader && authHeader.split(' ')[1];
        
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            const {payload} = decoded;

            const user = await User.findByIdAndUpdate<IUser>(payload.user._id, {new: true});
            req.user = user!;
            
            if (req.user.role == 0) next();
            else res.send("You are not allow to get this route").status(403);
        } catch (error) {
            res.status(401).json({status: 401, message: 'Invalid access token'});
        }
    } catch (err) {
        // err
        console.error(err)
        res.send('Token Invalid').status(500)
    }
} 