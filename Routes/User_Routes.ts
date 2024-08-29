import { Router } from "express";
import { Get_All, Login_User, Signup_User,User_Logout } from "../Controller/User_Controller";
import { Blank_User_Data } from "../Middleware/User_Detail_";
import { token_verify } from "../Middleware/Token_Verify";
import { is_admin } from "../Middleware/Is_Admin";
import { Get_User_Specific_Task } from "../Controller/Task_Management";

export const User_Routes = Router()

User_Routes.post('/signup',Blank_User_Data,Signup_User)
User_Routes.post('/login',Login_User)
User_Routes.get('/alluser',token_verify,Get_All)
User_Routes.get('/admin',is_admin,Get_All)
User_Routes.post('/logout',User_Logout)
User_Routes.get('/mytask',token_verify,Get_User_Specific_Task)