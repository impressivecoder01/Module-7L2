import type { NextFunction, Request, Response } from "express";

const auth = ()=>{
    return async (req:Request, res:Response, next: NextFunction) => {
    // console.log('this is protected route');
    console.log(req.headers.authorization );
    next()
}
}
export default auth;