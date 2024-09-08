import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
  store_id: { type: Number, required: true },
  customers_in: { type: Number, required: true },
  customers_out: { type: Number, required: true },
  time_stamp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 86400 }, // TTL field
});

const Message = mongoose.model("Message", MessageSchema);

export default Message;
