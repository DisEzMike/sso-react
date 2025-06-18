import { Request, RequestHandler, Response } from "express";
import { IRequest } from "../utils/type.ts";
import { createToken } from "../utils/auth.ts";

export const getUser: any = (req: IRequest, res: Response) => {
    const user = req.user
    const access_token = createToken({user});
    res.json({payload: {user}, access_token})
}