import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectToDB } from "./database/db.js";
import blogRoutes from "./routes/blog.routes.js";
import {
    startPaymentConsumer
} from "./services/kafka/payment.consumer.js";
import cors from "cors";
dotenv.config();

const app = express();
//cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const port = process.env.PORT;

// Middleware to parse JSON requests
app.use(express.json());
// routes
app.use("/blog", blogRoutes);
//start server
const startServer = async () => {
  try {
    await connectToDB();
    console.log("Database connected successfully");

    await startPaymentConsumer();

        console.log(
            "Blog Kafka Consumer Started"
        );

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to connect to the database:", error);
    process.exit(1); // Exit the process if DB connection fails
  }
};

startServer();

