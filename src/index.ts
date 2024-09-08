import dotenv from "dotenv";
dotenv.config();

import express from "express";
import http from "http";
import cors from "cors";

import { sendMessage, consumeMessage } from "./config/kafka";
import { connectDB } from "./config/db";

import historyRoute from "./routes/historyRoute";
import setupSocketIO from "./config/socketConfig";

const corsOrigin = process.env.CORS_ORIGIN;
const PORT = process.env.PORT;

const app = express();
const server = http.createServer(app);

const io = setupSocketIO(server);

app.use(
  cors({
    origin: corsOrigin,
  })
);

app.use("/api/history", historyRoute);

server.listen(PORT, async () => {
  await connectDB();
  console.log(`Listening on ${PORT}`);
  sendMessage();
  consumeMessage(io);
});
