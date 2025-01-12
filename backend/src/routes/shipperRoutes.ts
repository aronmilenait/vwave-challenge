import express from "express";
import { createLabel } from "../modules/shipper/controllers/shipperController";

const router = express.Router();

router.use("/labels", createLabel);

export default router;