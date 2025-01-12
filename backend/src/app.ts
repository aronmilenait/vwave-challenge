import express from "express";
import dotenv from "dotenv";
import shipperRoutes from "./routes/shipperRoutes";
import { connectDB, handleShutdown } from "../config/database";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/shipper", shipperRoutes);

connectDB(process.env.MONGODB_URI || "").then(() => {
  app.listen(process.env.PORT || 3000, () =>
    console.log(`Server running on port ${process.env.PORT || 3000}`)
  );
  handleShutdown("SIGINT");
  handleShutdown("SIGTERM");
});
