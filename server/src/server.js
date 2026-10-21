import app from './app.js';
import { connectDB } from './config/db.js';
import { config } from './config/env.js';

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB();

    const server = app.listen(config.port, () => {
      console.log(`===============================================`);
      console.log(`🚀 Code Minder Server running in ${config.nodeEnv} mode`);
      console.log(`📡 URL: http://localhost:${config.port}`);
      console.log(`🛡️ CORS Client: ${config.clientUrl}`);
      console.log(`🤖 Gemini Model: ${config.geminiModel} (${config.geminiApiKey ? 'API Key Active' : 'Fallback / Dev Mode'})`);
      console.log(`===============================================`);
    });

    // Handle unhandled promise rejections
    process.on('unhandledRejection', (err) => {
      console.error('UNHANDLED REJECTION! 💥 Shutting down...', err);
      server.close(() => {
        process.exit(1);
      });
    });

    // Handle SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
      server.close(() => {
        console.log('💥 Process terminated!');
      });
    });
  } catch (error) {
    console.error(`Error starting server: ${error.message}`);
    process.exit(1);
  }
};

startServer();
