import express from "express";
import { createLabel } from "../modules/shipper/controllers/shipperController";
import { getLabels } from "../modules/shipper/controllers/labelController";

const router = express.Router();

router.post("/labels", createLabel);

router.get("/labels", getLabels);

export default router;
