import { Request, Response } from "express";
import { db_connect } from "../Config/db_connection";
import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';


const jwt_key:any = process.env.JWT_KEY
export const Signup_User = async (req:Request,res:Response) =>
{
    try {
        const user:any = 
        {
            username:req.body.username,
            email:req.body.email,
            password:req.body.password,
            role:req.body.role
        }
        let hash_pass = await bcryptjs.hash(user.password,10)
        user.password = hash_pass
    
        db_connect.query('SELECT * FROM users WHERE email=?',[user.email], async (err:any,data:any) =>
        {
            if(err)
            {
                console.log('Select All Data Qurey Error ====>',err);
                res.status(500).send({msg:'Internal Server Error...'})
            }
            if(data.length > 0)
            {
                res.status(500).send({msg:'Email Alredy Register',data:data})
            }
            else
            {   
                db_connect.query('INSERT INTO users SET ?',[user],(err:any,data_1:any) =>
                    {
                        if(err)
                        {
                            console.log('Signup User Qurey Error ===========>',err);
                        }
                        else
                        {
                            res.status(200).send({msg:'User Create SuccessFully',data_1:user})
                            console.log('User Create Data =====>',data_1);
                            
                        }
                    })
            }
        })
    } catch (error) {
        console.log('Error ==>',error);
        res.status(500).send({msg:'Internal Server Error....'})
    }
}

export const Login_User = async (req:Request,res:Response) =>
{
   try {
     const user = 
     {
         email:req.body.email,
         password:req.body.password
     }
 
     db_connect.query('SELECT * FROM users WHERE email=?',[user.email], async (err:any,data_1:any) =>
     {
         if(err)
         {
             console.log('Login User Qurey Error ====>',err);
         }
         if(data_1.length==0)
         {
             res.status(400).send({msg:'Invalid Email And Password...'})
             return
         }
         else
         {
             let pass_check:any = await bcryptjs.compare(user.password,data_1[0].password)
             if(!pass_check)
             {
                 res.status(400).send({msg:'Invalid Email And Password...'})
                 
             }
             else
             {
                 let token_encode = jwt.sign(data_1[0].user_id,jwt_key)
                 res.cookie(process.env.COOKIEKEY as string,token_encode,{httpOnly:true})
                 res.status(200).send({msg:'Login SuccessFully..'})
             }
             console.log('Data ====>',data_1[0]);
             
         }
     })
   } catch (error) {
        console.log('Login Function Error =====>',error);
        res.status(500).send('Internal Server Error...')
   }
}

export const User_Logout = (req:Request,res:Response) =>
{
    let cookie_key:any = process.env.COOKIEKEY
    res.clearCookie(cookie_key)
    res.send({msg:'Logout SuccessFully...'})
}

export const Get_All = (req:Request,res:Response) =>
{
    try {
        db_connect.query('SELECT * FROM users',(err:any,data:any)=>
        {
            if(err)
            {
                console.log("Get All Qurey Error ====>",err);
            }
            else
            {
                res.status(200).send({msg:'Get All Login User Data',data:data})
            }
        })
    } catch (error) {
        console.log('Get All Function Error ====>',error);
        res.status(500).send({msg:'Internal Server Error...'})
    }
}
