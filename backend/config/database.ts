import { connect, disconnect } from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";

let mongoServer: MongoMemoryServer | null = null;

export const connectDB = async () => {
  if (process.env.NODE_ENV === "testing") {
    await connectTestDB();
  } else {
    await connectDatabase(process.env.MONGODB_URI || "");
  }
};

export const connectDatabase = async (uri: string) => {
  try {
    await connect(uri);
    console.log("Successfully connected to the database");
  } catch {
    await disconnect();
  }
};

export const connectTestDB = async () => {
  try {
    if (!mongoServer) {
      mongoServer = await MongoMemoryServer.create();
    }
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
  } catch {
    await mongoose.disconnect();
  }
};

export const handleShutdown = (signal: string) => {
  process.on(signal, async () => {
    await disconnect();
    process.exit(0);
  });
};
