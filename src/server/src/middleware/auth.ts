import { NextFunction, Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { IRequest } from "../utils/type.ts";
import { IUser, User } from "../database/model/User.ts";

export const authMiddleware:any = async (req: IRequest, res: Response, next: NextFunction) => {
    try {
        //code
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).send('Unauthorize');

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const {payload} = decoded;

        const user = await User.findByIdAndUpdate<IUser>(payload.user._id, {new: true});
        req.user = user!;

        console.log(user);
        
        next();
    } catch (err) {
        // err
        console.error(err)
        res.send('Token Invalid').status(500)
    }
}


// export const checkAdmin:any = async (req: IRequest, res: Response, next: NextFunction) => {
//     try {
//         //code
//         const token = req.headers["x-access-token"] as string

//         if (!token) {
//             return res.status(401).send('No token');
//         }
//         const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;

//         const user = await User.findOne({userId: decoded.user.userId});
//         req.user = user;
        
//         if (req.user.role == 'admin') next();
//         else res.send("You are not allow to get this route").status(403);
//     } catch (err) {
//         // err
//         console.error(err)
//         res.send('Token Invalid').status(500)
//     }
// } 