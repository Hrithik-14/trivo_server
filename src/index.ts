import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./configs/db";
import authRoutes from "./routes/authRoutes";
import { errorMiddleware } from "./helper/errorMiddleware";
import projectRoutes from './routes/projectRoutes'
import searchRoutes from './routes/searchRoutes'
import payslipsRoutes from './routes/payslipsRoutes'
import path from "path";
import { initSocket } from "./socket";
import http from "http"

dotenv.config();

const app: Application = express();
const port = process.env.PORT;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));
const server = http.createServer(app);
initSocket(server);

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api', authRoutes)
app.use('/api', projectRoutes)
app.use('/api', searchRoutes)
app.use('/api', payslipsRoutes)



app.use(errorMiddleware);


app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
