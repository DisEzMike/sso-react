import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IRequest } from "../utils/interfaces.ts";
import { IUser, User } from "../database/model/User.ts";
import { getAuthCode } from "../utils/auth.ts";
import { LOCAL_CLIENT_ID } from "../../../client/utils/contant.ts";
import { HOST } from "../utils/contant.ts";

export const authMiddleware:any = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        //code
        const authHeader = req.headers['authorization'];
        if (!authHeader) return res.status(401).json({status: 401, message: 'Missing Authorization header'});
        const token = authHeader && authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
            const {payload} = decoded;
            req.token = payload;
            const user = await User.findByIdAndUpdate<IUser>(payload.sub, {new: true});
            req.user = user!;
                    
            next();
        } catch (error) {
            res.status(401).json({status: 401, message: 'Invalid access token'});
        }

    } catch (err) {
        // err
        console.error(err)
        res.status(401).send({status: 401, message: 'Token Invalid'});
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
            req.token = payload;
            const user = await User.findByIdAndUpdate<IUser>(payload.sub, {new: true});
            req.user = user!;
            
            if (req.user.role == 0) next();
            else res.status(403).json({status: 403, message: "You are not allow to get this route"});
        } catch (error) {
            res.status(401).json({status: 401, message: 'Invalid access token'});
        }
    } catch (err) {
        // err
        console.error(err)
        res.status(401).json({status: 401, message: 'Token Invalid'});
    }
} 