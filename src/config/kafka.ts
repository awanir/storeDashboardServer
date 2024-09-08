import { Kafka } from "kafkajs";
import Message from "../models/message";

const KAFKA_TOPIC = process.env.KAFKA_TOPIC as string;
const KAFKA_URL = process.env.KAFKA_URL as string;
const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID as string;
const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID as string;

if (!KAFKA_URL || !KAFKA_TOPIC || !KAFKA_GROUP_ID || !KAFKA_CLIENT_ID) {
  throw new Error("One or more Kafka environment variables are not set");
}

const kafka = new Kafka({
  clientId: KAFKA_CLIENT_ID,
  brokers: [KAFKA_URL],
});

export async function sendMessage() {
  const producer = kafka.producer();

  await producer.connect();
  await producer.send({
    topic: KAFKA_TOPIC,
    messages: [
      {
        value: JSON.stringify({
          store_id: 10,
          customers_in: 2,
          customers_out: 0,
          time_stamp: "10:15:12",
        }),
      },
    ],
  });

  await producer.disconnect();
}

export async function consumeMessage(io: any) {
  const consumer = kafka.consumer({ groupId: KAFKA_GROUP_ID });

  await consumer.connect();
  await consumer.subscribe({ topic: KAFKA_TOPIC, fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const messageValue = message.value?.toString();

      // Check if messageValue is undefined or null before parsing
      if (messageValue) {
        try {
          let currentMessage = JSON.parse(messageValue);

          const newMessage = {
            store_id: currentMessage.store_id,
            customers_in: currentMessage.customers_in,
            customers_out: currentMessage.customers_out,
            time_stamp: currentMessage.time_stamp,
          };

          const savedMessage = await new Message(newMessage).save();

          // Emit the message to all connected clients
          io.emit("message", {
            store_id: savedMessage.store_id,
            customers_in: savedMessage.customers_in,
            customers_out: savedMessage.customers_out,
            time_stamp: savedMessage.time_stamp,
          });

          console.log({
            value: currentMessage,
          });
        } catch (error) {
          console.error("Failed to parse message", error);
        }
      } else {
        console.warn("Received an empty or undefined message value");
      }
    },
  });
}
