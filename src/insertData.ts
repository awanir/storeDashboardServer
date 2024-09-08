import dotenv from "dotenv";
dotenv.config();
import { MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI as string;

if (!MONGO_URI) {
  throw new Error("MONGO_URI is not defined");
}

const client = new MongoClient(MONGO_URI);

interface StoreData {
  store_id: number;
  customers_in: number;
  customers_out: number;
  time_stamp: string;
  createdAt: Date;
}

const generateData = (): StoreData[] => {
  const data: StoreData[] = [];
  const currentDate = new Date();

  for (let i = 0; i < 100; i++) {
    const hours = Math.floor(Math.random() * 24);
    const minutes = Math.floor(Math.random() * 60);
    const seconds = Math.floor(Math.random() * 60);

    const timeStamp = `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    const createdAt = new Date(currentDate);
    createdAt.setHours(currentDate.getHours() - hours);
    createdAt.setMinutes(currentDate.getMinutes() - minutes);
    createdAt.setSeconds(currentDate.getSeconds() - seconds);

    data.push({
      store_id: 10,
      customers_in: Math.floor(Math.random() * 50) + 1,
      customers_out: Math.floor(Math.random() * 50) + 1,
      time_stamp: timeStamp,
      createdAt: createdAt,
    });
  }

  return data;
};

const data = generateData();

async function run() {
  try {
    await client.connect();
    const database = client.db("storedashboard");
    const collection = database.collection("messages");

    // Set TTL index on 'createdAt' field to automatically delete documents after 24 hours
    await collection.createIndex(
      { createdAt: 1 },
      { expireAfterSeconds: 86400 }
    );

    const result = await collection.insertMany(data);
    console.log(`${result.insertedCount} documents were inserted.`);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
