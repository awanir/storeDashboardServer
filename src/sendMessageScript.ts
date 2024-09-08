import dotenv from "dotenv";
dotenv.config();

import { sendMessage } from "./config/kafka";

const run = async () => {
  try {
    await sendMessage();
    console.log("Message sent successfully");
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

run();
