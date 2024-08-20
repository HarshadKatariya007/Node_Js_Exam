import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'

let jwt_key:any = process.env.JWT_KEY
export const token_verify = (req:Request,res:Response,next:NextFunction) =>
{
    console.log("Token Check =====>",req.headers.cookie);

    try {
        let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
        
        if(!token_split)
        {
            res.status(401).send({msg:'Unauthorized User...'})
            return
        }
        
        let token_decode = jwt.verify(token_split,jwt_key)
        console.log('Token Decode ======>',token_decode);
    
        if(!token_decode)
        {
            res.status(401).send({msg:'Unauthorized User...'})
        }
        else
        {
            next()
        }
    } catch (error) {
        console.log('Token Verify Error ====>',error);
        res.status(500).send({msg:'Internal Server Error....'})
    }
}