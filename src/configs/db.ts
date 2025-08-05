import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()
console.log("MONGO_URL from .env:", process.env.MONGO_URL);

const connectDB = async () => {
    const mongoURL = process.env.MONGO_URL;

    if (!mongoURL) {
        throw new Error("MONGO_URL is not defined in environment variables.");
    }

    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        } as mongoose.ConnectOptions);
        console.log("MongoDB connected");
    } catch (err) {
        console.error("MongoDB connection error:", err);
        process.exit(1);
    }
}

export default connectDB;
