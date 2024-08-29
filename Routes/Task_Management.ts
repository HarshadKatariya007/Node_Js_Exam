import { Router } from "express";
import { Add_Task,Submit_Task, Task_Status_Complate, Task_Status_OnHold, Task_Status_Reopen,} from "../Controller/Task_Management";
import { token_verify } from "../Middleware/Token_Verify";
import { is_admin } from "../Middleware/Is_Admin";
import { Task_Data_Check } from "../Middleware/User_Detail_";

export const Task_Route = Router()

Task_Route.post('/add_task',token_verify,is_admin,Task_Data_Check,Add_Task)
Task_Route.put('/task_submit',token_verify,Submit_Task)
Task_Route.put('/onhold',token_verify,Task_Status_OnHold)
Task_Route.put('/reopen',token_verify,Task_Status_Reopen)
Task_Route.put('/complate',token_verify,Task_Status_Complate)
// Task_Route.post('/assign_task',token_verify,is_admin,User_Task_Assign)