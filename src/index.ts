import express from "express";
import authRoutes from "./routes/authRoutes"
import dotenv from "dotenv"
import connectDB from "./configs/db";
import { errorMiddleware } from "./helper/errorMiddleware";

dotenv.config()

const app = express()
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 3001
connectDB()

app.use('/api', authRoutes)


app.use(errorMiddleware)

app.listen(port, ()=>{
    console.log(`Server is running at ${port}`);
})

