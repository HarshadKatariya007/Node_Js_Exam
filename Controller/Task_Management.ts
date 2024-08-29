import { NextFunction, Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { db_connect } from "../Config/db_connection";

let jwt_key:any = process.env.JWT_KEY
export const Add_Task = (req:Request,res:Response,next:NextFunction) =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)
    console.log("TOKKEEKE ====>",token_decode);
    
    
    const {email} = req.body
    db_connect.query('SELECT * FROM users WHERE email=?',[email],(err:any,data_1:any) =>
    {
        if(err)
        {
            console.log('Task Manegent Email Qurey Error =======>',err);
        }
        if(data_1.length==0)
        {
            res.status(400).send({msg:'Email Not Found...'})
            return
        }
        else
        {
            // res.status(200).send({msg:"Email Find",data:data_1[0]})

            const task_add = 
            {
                task_title:req.body.task_title,
                task_details:req.body.task_details,
                task_category:req.body.task_category,
                user_id:token_decode,
            }
            db_connect.query('INSERT INTO task_data SET ?',[task_add],(err:any,data:any)=>
                {
                    if(err)
                    {
                        console.log('Task Add Qurey Error ====>',err);
                    }
                    else
                    {
                       console.log('Data =========----->',data_1[0]);
                       
                       const assign_task_payload = 
                       {
                            task_data_id:data.insertId,
                            assign_task_by:token_decode,
                            assign_task_to:data_1[0].user_id
                       }
                       console.log('INSERT DATA =====>',data.insertId);
                       
                       db_connect.query('INSERT INTO assign_task SET ?',[assign_task_payload],(err:any,data_2:any) =>
                        {
                            if(err)
                            {
                                console.log('Update Assign Task Qurey Error =====>',err);
                            }
                            else
                            {
                                console.log('DATA 2 ====----->',data_2);
                                db_connect.query(`UPDATE assign_task SET assign_task_status='processing' WHERE task_data_id=? AND assign_task_to=?`,[data.insertId,data_1[0].user_id],(err:any,task:any)=>
                                {
                                    if(err)
                                    {
                                        console.log('Update Satus Qurey Error ======---->',err);
                                    }
                                    else
                                    {
                                        next()
                                    }
                                })
                                res.status(200).send({msg:'Task Assign SuccessFully.....',data:task_add})
                            }
                        })
                    }
                })
        }
    })

   
}

export const Get_User_Specific_Task = (req:Request,res:Response) =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)

    db_connect.query(`SELECT tb_user.username,tb_user_to.username,tb_task_data.task_title,tb_task_data.task_details,tb_task_data.task_category,tb_assign_task.assign_task_status  FROM assign_task  as tb_assign_task
                      LEFT JOIN task_data as tb_task_data ON tb_assign_task.task_data_id = tb_task_data.task_data_id
                      LEFT JOIN users as tb_user ON tb_assign_task.assign_task_by = tb_user.user_id
                      LEFT JOIN users as tb_user_to ON tb_assign_task.assign_task_to = tb_user_to.user_id  WHERE tb_assign_task.assign_task_to=?`,[token_decode],(err:any,data:any)=>
    {
        if(err)
        {
            console.log('Get User Specific Task Qurey Error ======>',err);
        }
        else
        {
            console.log('Get User Task ====>',data);
            
            res.status(200).send({msg:'Get User Task',data})
        }
    })
}


export const Submit_Task = (req:Request,res:Response)  =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)

    db_connect.query('SELECT * FROM assign_task WHERE assign_task_to=?',[token_decode],(err:any,data:any) =>
    {
        if(err)
        {
            console.log('Submit Task Qurey Error =====--->',err);
        }
        else
        {
            const payload =
            {
                task_data_id:req.body.task_data_id,
            }
             
             db_connect.query('UPDATE assign_task SET assign_task_status="inreview" WHERE task_data_id=? AND assign_task_to=?',[payload.task_data_id,token_decode],(err:any,data_1:any) =>
            {
                if(err)
                {
                    console.log('Update Assign_Task Qurey Error ======---->',err);
                }
                else
                {
                    res.status(200).send({msg:'Task Submit SuccessFully...'})
                }
            })
        }
    })
}

export const Task_Status_OnHold = (req:Request,res:Response) =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)
    const payload =
    {
        task_data_id:req.body.task_data_id,
    }

    db_connect.query('UPDATE assign_task SET assign_task_status="onhold" WHERE task_data_id=? AND assign_task_to=?',[payload.task_data_id,token_decode],(err:any,data:any) =>
    {
        if(err)
        {
            console.log('Task Status OnHold Qurey Error =======--->',err);
        }
        else
        {
            res.status(200).send({msg:'SuccessFully...'})
        }
    })
}
export const Task_Status_Reopen = (req:Request,res:Response) =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)
    const payload =
    {
        task_data_id:req.body.task_data_id,
    }
    
    db_connect.query('UPDATE assign_task SET assign_task_status="reopen" WHERE task_data_id=? AND assign_task_to=?',[payload.task_data_id,token_decode],(err:any,data:any) =>
    {
        if(err)
        {
            console.log('Task Status OnHold Qurey Error =======--->',err);
        }
        else
        {
            res.status(200).send({msg:'SuccessFully...'})
        }
    })
}

export const Task_Status_Complate = (req:Request,res:Response) =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)
    const payload =
    {
        task_data_id:req.body.task_data_id,
    }
        
    db_connect.query('UPDATE assign_task SET assign_task_status="complate" WHERE task_data_id=? AND assign_task_to=?',[payload.task_data_id,token_decode],(err:any,data:any) =>
    {
        if(err)
        {
            console.log('Task Status OnHold Qurey Error =======--->',err);
        }
        else
        {
            res.status(200).send({msg:'SuccessFully...'})
        }
    })
}