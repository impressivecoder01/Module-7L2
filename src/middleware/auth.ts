import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import config from "../config";

const auth = ()=>{
    return async (req:Request, res:Response, next: NextFunction) => {
    // console.log('this is protected route');
    // console.log(req.headers.authorization );
    const token = req.headers.authorization;
    // console.log(token);
    if(!token){
        res.status(401).json({
            success: false,
            message: "Unauthorized access",
        })
    }
    const decode = jwt.verify(token as string,config.secret as string)
    console.log(decode);

    next()
}
}
export default auth;