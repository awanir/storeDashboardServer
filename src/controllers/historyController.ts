import { Request, Response } from "express";
import { getHistoryByStoreId } from "../queries/historyQuery";

export const getHistory = async (req: Request, res: Response) => {
  try {
    const storeId = parseInt(req.params.storeId, 10);
    const result = await getHistoryByStoreId(storeId);
    return res.status(200).json({ data: result });
  } catch (error) {
    console.error("Error fetching history:", error);
    return res
      .status(500)
      .json({ error: "An error occurred while fetching history." });
  }
};
