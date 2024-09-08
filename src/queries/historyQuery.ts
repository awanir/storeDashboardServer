import Message from "../models/message";
import { PipelineStage } from "mongoose";

export const getHistoryByStoreId = async (storeId: number) => {
  try {
    const pipeline: PipelineStage[] = [
      {
        $match: { store_id: storeId }, // Filter by store_id
      },
      {
        $addFields: {
          hour: {
            $toInt: {
              $substr: ["$time_stamp", 0, 2], // Extract the hour part as an integer
            },
          },
        },
      },
      {
        $group: {
          _id: "$hour", // Group by the hour
          total_customers_in: { $sum: "$customers_in" },
          total_customers_out: { $sum: "$customers_out" },
        },
      },
      {
        $project: {
          _id: 0,
          interval: {
            $concat: [
              {
                $cond: [
                  { $lt: ["$_id", 10] },
                  { $concat: ["0", { $toString: "$_id" }] },
                  { $toString: "$_id" },
                ],
              },
              "-",
              {
                $cond: [
                  { $lt: [{ $add: ["$_id", 1] }, 10] },
                  { $concat: ["0", { $toString: { $add: ["$_id", 1] } }] },
                  { $toString: { $add: ["$_id", 1] } },
                ],
              },
            ],
          },
          total_customers_in: 1,
          total_customers_out: 1,
        },
      },
      {
        $sort: { interval: 1 }, // Sort by the hour intervals
      },
    ];

    return await Message.aggregate(pipeline);
  } catch (error) {
    console.error("Error fetching history:", error);
    throw new Error("An error occurred while fetching history.");
  }
};
