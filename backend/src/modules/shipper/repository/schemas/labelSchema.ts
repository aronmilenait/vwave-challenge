import { Schema } from "mongoose";
import { ILabel } from "../interfaces/labelInterface";

export const labelSchema = new Schema<ILabel>({
    b64: { type: String, required: true },
    fileFormat: { type: String, required: true },
    printFormat: { type: String, required: true },
});