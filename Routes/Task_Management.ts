import { Router } from "express";
import { Add_Task,} from "../Controller/Task_Management";
import { token_verify } from "../Middleware/Token_Verify";
import { is_admin } from "../Middleware/Is_Admin";
import { Task_Data_Check } from "../Middleware/User_Detail_";

export const Task_Route = Router()

Task_Route.post('/add_task',token_verify,is_admin,Task_Data_Check,Add_Task)
// Task_Route.post('/assign_task',token_verify,is_admin,User_Task_Assign)