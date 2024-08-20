import { NextFunction, Request, Response } from "express";
import { db_connect } from "../Config/db_connection";
import jwt from 'jsonwebtoken'

let jwt_key:any = process.env.JWT_KEY

export const is_admin = (req:Request,res:Response,next:NextFunction) =>
{
  try {
      let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
      let token_decode = jwt.verify(token_split,jwt_key)
      db_connect.query('SELECT * FROM users WHERE user_id=?',[token_decode],(err:any,data:any) =>
      {
          if(err)
          {
              console.log('Is Admin User Id Get Qurey Error =====>',err);
          }
          else
          {
              
              console.log('Is Admin ------>',data[0]);
              if(data[0].role=='admin')
              {
                  next()
              }
              else
              {
                  res.status(400).send({msg:'This Page Not For User Only Allow Admin...'})
              }
          }
      })
  } catch (error) {
    console.log('Error From Is Admin Function...',error);
    res.status(500).send({msg:'Internal Server Error...'})
  }
}