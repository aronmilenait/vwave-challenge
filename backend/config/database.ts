import { connect, disconnect } from "mongoose";

export const connectDB = async (uri: string) => {
  try {
    await connect(uri);
  } catch {
    disconnect();
    process.exit(1);
  }
};

export const handleShutdown = (signal: string) => {
  process.on(signal, async () => {
    console.log(`Received ${signal}. Closing connection to MongoDB...`);
    await disconnect();
    console.log("Connection to MongoDB closed.");
    process.exit(0);
  });
};
