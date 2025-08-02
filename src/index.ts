import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db";
import authRoutes from "./routes/authRoutes";
import { errorMiddleware } from "./helper/errorMiddleware";

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', authRoutes);

app.use(errorMiddleware);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
