import { env } from '../config/env';

console.log('Environment Configuration:');
console.log('------------------------');
console.log(`NODE_ENV: ${env.nodeEnv}`);
console.log(`PORT: ${env.port}`);
console.log(`MONGODB_URI: ${env.mongodbUri.substring(0, 20)}...`); // Only show part of the URI for security
console.log(`JWT_SECRET: ${env.jwtSecret ? '✓ Set' : '✗ Not Set'}`);
console.log('------------------------');
console.log('Environment verification complete!'); 