import { RequestHandler } from "express";
import { loginType } from "../utils/type.js";
import axios from "axios";

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

                res.json(response.data)
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