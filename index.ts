import express from 'express'
import dotenv from 'dotenv'
import { User_Routes } from './Routes/User_Routes'
import cookieParser from 'cookie-parser'
import { Task_Route } from './Routes/Task_Management'

dotenv.config()
const App = express()
App.use(cookieParser())
App.use(express.json())
let port = process.env.PORT_NUM

App.use('/user',User_Routes)
App.use('/task',Task_Route)

App.listen(port,() =>
{
    console.log(`Sever Is Running On http://localhost:${port}`);
})