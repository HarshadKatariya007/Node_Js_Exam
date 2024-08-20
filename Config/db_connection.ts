import mysql from 'mysql2';
import dotenv from 'dotenv'

dotenv.config()

export const db_connect = mysql.createConnection
({
    host:process.env.DB_HOST,
    user:process.env.DB_USER,
    password:process.env.DB_PASS,
    database:process.env.DB_NAME
})

db_connect.connect((err) =>
{
    if(err)
    {
        console.log('Database Connect Error',err);
    }
    else
    {
        console.log('Database Connect SuccessFully....');
    }
})