import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

// Default values for development
const defaultValues = {
  MONGODB_URI: 'mongodb://localhost:27017/gambling',
  PORT: '3000',
  JWT_SECRET: 'development_secret',
  NODE_ENV: 'development'
};

// Validate required environment variables
const requiredEnvVars = ['MONGODB_URI', 'PORT', 'JWT_SECRET'] as const;

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(`Missing required environment variable: ${envVar}`);
    } else {
      console.warn(`Warning: ${envVar} not found in environment variables, using default value`);
      process.env[envVar] = defaultValues[envVar];
    }
  }
}

// Export validated environment variables
export const env = {
  mongodbUri: process.env.MONGODB_URI!,
  port: parseInt(process.env.PORT!, 10),
  jwtSecret: process.env.JWT_SECRET!,
  nodeEnv: process.env.NODE_ENV || 'development',
} as const; 