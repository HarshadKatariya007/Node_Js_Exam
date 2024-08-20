import { Request, Response } from "express";
import jwt from 'jsonwebtoken'
import { db_connect } from "../Config/db_connection";

let jwt_key:any = process.env.JWT_KEY
export const Add_Task = (req:Request,res:Response) =>
{
    let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
    let token_decode = jwt.verify(token_split,jwt_key)
    console.log("TOKKEEKE ====>",token_decode);
    
    const task_add = 
    {
        task_title:req.body.task_title,
        task_details:req.body.task_details,
        task_category:req.body.task_category,
        user_id:token_decode,
        assign_task:req.body.assign_task
    }

    db_connect.query('INSERT INTO task_data SET ?',[task_add],(err:any,data:any)=>
    {
        if(err)
        {
            console.log('Task Add Qurey Error ====>',err);
        }
        else
        {
            res.status(200).send({msg:'Add SuccessFully',data:task_add})
        }
    })
}

// export const User_Task_Assign = (req:Request,res:Response) =>
// {
//     let token_split:any = req.headers.cookie?.split(`${process.env.COOKIEKEY}=`)[1]
//     let token_decode = jwt.verify(token_split,jwt_key)

//     db_connect.query('SELECT * FROM users WHERE user_id=?',[token_decode],(err:any,data:any)=>
//     {
//         if(err)
//         {
//             console.log('User_Task Assign Qurey Error ======>',err);
//         }
//         else
//         {
//             const data_id = 
//             {
//                 assign_task :req.body.assign_task
//             }
//             db_connect.query('SELECT * FROM users WHERE user_id=?',[data_id.assign_task],(err:any,data_1:any) =>
//             {
//                 if(err)
//                 {
//                     console.log('Qurey Error =====>',err);
//                 }
//                 else
//                 {
//                     res.status(200).send({msg:'Task Assign SuccessFully...'})
//                     console.log("Assign Task User Id ====>",data_1);
//                 }
//             })
//         }
//     })
// }

