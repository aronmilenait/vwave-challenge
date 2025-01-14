import { Request, Response } from "express";
import {
  createShippingLabel,
  getAccessToken,
} from "../services/shipperService";
import { requiredFieldsError } from "./errors";
import { createShippingLabelError } from "../services/errors";

export const createLabel = async (req: Request, res: Response) => {
  try {
    const { name, street, postalCode, city } = req.body;

    if (!name || !street || !postalCode || !city) {
      res.status(400).json({
        error: requiredFieldsError,
      });
      return;
    }

    const token = await getAccessToken();

    const labelPdf = await createShippingLabel(token, {
      name,
      street,
      postalCode,
      city,
    });

    res.status(201).json({ labelPdf });
  } catch {
    res.status(500).json({ error: createShippingLabelError });
  }
};
