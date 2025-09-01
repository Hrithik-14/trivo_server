import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import http from 'http'
import { Server } from "socket.io";


import connectDB from "./configs/db";
import authRoutes from "./routes/authRoutes";
import projectRoutes from './routes/projectRoutes'
import searchRoutes from './routes/searchRoutes'
import payslipsRoutes from './routes/payslipsRoutes'
import groupRoutes from './routes/groupRoutes'
import messageRoutes from './routes/messageRoutes'
import taskRoutes from './routes/taskRoutes';
import attendnaceRoutes from './routes/attendanceRoutes';
import notificationRoutes from './routes/notificationRoutes'
import { errorMiddleware } from "./helper/errorMiddleware";
import { socketHandler } from "./socket";
import reportRoutes from "./routes/reportRoutes";
import leaveRoutes from "./routes/leaveRoutes";
import alertRoutes from "./routes/alertRoutes";


dotenv.config();
connectDB();

const app: Application = express();
const port = process.env.PORT || 3001   ;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));



app.use('/api', authRoutes)
app.use('/api', projectRoutes)
app.use('/api', searchRoutes)
app.use('/api', payslipsRoutes)
app.use('/api', groupRoutes)
app.use('/api', messageRoutes)
app.use('/api', reportRoutes)
app.use('/api', attendnaceRoutes)
app.use('/api', taskRoutes);
app.use('/api', notificationRoutes);
app.use('/api', leaveRoutes)
app.use('/api', alertRoutes)


app.use(errorMiddleware);


const server = http.createServer(app)

const io = new Server(server, {
    cors: {
        origin: process.env.FRONTEND_URL,
        credentials: true,
    }
})

socketHandler(io)


server.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});