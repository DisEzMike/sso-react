import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/interfaces.ts";
import { createToken } from "../utils/auth.ts";

export const getUser: any = (req: IRequest, res: Response) => {
    const user = req.user
    const access_token = createToken({user});
    const payload = {
        displayName: user.displayName,
        email: user.email,
        access_token,
        user
    }
    res.cookie("sso_token", access_token, {
        domain: '.mikenatcavon.com',
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 24 * 60 * 60 * 1000
    })
    res.json(payload)
}