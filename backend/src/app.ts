import express from "express";
import dotenv from "dotenv";
import shipperRoutes from "./routes/shipperRoutes";
import { connectDB, handleShutdown } from "../config/database";
import cors from "cors";

dotenv.config();

export const createApp = () => {
  const app = express();

  const allowedOrigins = [
    "http://localhost:5173",
    "https://vwavechallenge.vercel.app/",
  ];

  const options: cors.CorsOptions = {
    origin: allowedOrigins,
    credentials: true,
  };

  app.use(cors(options));

  app.use(express.json());

  app.use("/shipper", shipperRoutes);

  connectDB().then(() => {
    app.listen(process.env.PORT || 3000, () =>
      console.log(`Server running on port ${process.env.PORT || 3000}`)
    );
    handleShutdown("SIGINT");
    handleShutdown("SIGTERM");
  });

  return app;
};

export const app = createApp();
