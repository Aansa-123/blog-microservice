import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectToDB } from "./database/db.js";
import blogRoutes from "./routes/blog.routes.js";
import {
    startPaymentConsumer
} from "./services/kafka/payment.consumer.js";
import cors from "cors";
import client from "prom-client";
//config fix
dotenv.config();

const app = express();

// Prometheus metrics collection
const register = new client.Registry();
client.collectDefaultMetrics({ 
    register 
});
//cors
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

const port = process.env.PORT;

// Middleware to parse JSON requests
app.use(express.json());

// Prometheus metrics endpoint
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status_code"],
  buckets: [0.1, 0.5, 1, 2, 5],
  registers: [register]
});

app.use((req, res, next) => {
  const start = process.hrtime();

  res.on("finish", () => {
    const duration = process.hrtime(start);
    const durationInSeconds =
      duration[0] + duration[1] / 1e9;

    httpRequestDuration.observe(
      {
        method: req.method,
        route: req.route?.path || req.path,
        status_code: res.statusCode,
      },
      durationInSeconds
    );
  });

  next();
});


// Prometheus metrics endpoint
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});



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

