import { NextFunction, Request, Response } from "express";

export const Blank_User_Data = (req:Request,res:Response,next:NextFunction) =>
{
    const user:any =
    {
        username:req.body.username,
        password:req.body.password,
        email:req.body.email,
        role:req.body.role
    }
    if(!user.username || !user.password || !user.email || !user.role)
    {
       res.send({msg:'Invalid Data..'})
    }
    else
    {
        next()
    }
}

export const Task_Data_Check = (req:Request,res:Response,next:NextFunction) =>
{
    const task_add = 
    {
        task_title:req.body.task_title,
        task_details:req.body. task_details,
        task_category:req.body.task_category
    }

    if(!task_add.task_title || !task_add.task_details || !task_add.task_category)
    {
        res.status(400).send({msg:'Invalid Data...'})
    }
    else
    {
        next()
    }
}