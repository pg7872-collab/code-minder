import mongoose from 'mongoose';
import { config } from './env.js';

let memoryServerInstance = null;

export const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    
    // Set a 4 second server selection timeout for the initial connection attempt
    await mongoose.connect(config.mongoUri, {
      serverSelectionTimeoutMS: 4000,
    });
    console.log(`[Database] MongoDB connected successfully to: ${config.mongoUri}`);
  } catch (primaryError) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${config.mongoUri}. Error: ${primaryError.message}`);

    if (config.nodeEnv !== 'production') {
      try {
        console.log('[Database] Starting in-memory MongoDB server for seamless development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServerInstance = await MongoMemoryServer.create();
        const memUri = memoryServerInstance.getUri();
        await mongoose.connect(memUri);
        console.log(`[Database] In-memory MongoDB connected successfully at ${memUri}`);
        return;
      } catch (memError) {
        console.error('[Database] In-memory MongoDB failed to start:', memError.message);
      }
    }

    throw primaryError;
  }
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
  }
};
