import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/codeminder',
  jwtSecret: process.env.JWT_SECRET || 'code_minder_development_jwt_secret_key_8492049284092840928',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
  clistApiKey: process.env.CLIST_API_KEY || '',
  clistUserName: process.env.CLIST_USER_NAME || '',
};
