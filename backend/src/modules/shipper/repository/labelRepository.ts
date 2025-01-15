import { model } from "mongoose";
import { labelSchema } from "./schemas/labelSchema";
import { ILabel } from "./interfaces/labelInterface";
import { createLabelError, getLabelsFromDBError } from "./errors";

const Label = model<ILabel>("Label", labelSchema);

export const createLabelInDB = async (label: ILabel) => {
  try {
    const newLabel = new Label(label);
    return await newLabel.save();
  } catch {
    throw new Error(createLabelError);
  }
};

export const getLabelsFromDB = async () => {
  try {
    return await Label.find();
  } catch {
    throw new Error(getLabelsFromDBError);
  }
};
