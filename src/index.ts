import express from "express";
import { Request,Response } from "express";
import dotenv from "dotenv"

dotenv.config()

const app = express()

const port = process.env.PORT || 3001

app.get('/api',(req:Request,res:Response)=>{
    const response :string = "HEllo World"
    res.send(response)
})
app.listen(port, ()=>{
    console.log(`Server is running at ${port}`);
})

