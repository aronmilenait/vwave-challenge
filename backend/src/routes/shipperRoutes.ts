import express from "express";
import { createLabel } from "../modules/shipper/controllers/shipperController";

const router = express.Router();

router.post("/labels", createLabel);

export default router;