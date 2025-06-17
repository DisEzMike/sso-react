import { RequestHandler } from "express";
import { loginType } from "../utils/type.js";

export const loginRoute: RequestHandler = (req, res) => {

    if (!req.body) res.status(403).json({status: 403, message: "body not provide."});
    else {
        const {body} = req;
    
        const {type, data} = body as loginType;
    
        if (type == "local") {
            res.status(404).json({status: 404, message: "Local login is not active"});
        } else if (type == "google") {
            const tokenResponse = data;
            console.log(tokenResponse);
            res.status(200).json(tokenResponse);
        } else if (type == "line") {
            res.status(404).json({status: 404, message: "Local login is not active"});
        } else {
            res.status(404).json({status: 403, message: "type is not provide"});
        }
    }
}