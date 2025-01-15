import { Request, Response } from "express";
import { getAllLabels } from "../services/labelService";
import { getLabelsError } from "./errors/labelControllerErrors";

export const getLabels = async (req: Request, res: Response) => {
  try {
    const labels = await getAllLabels();
    console.log(labels);
    res.status(200).json({ labels });
  } catch {
    res.status(500).json({
      error: getLabelsError,
    });
  }
};
