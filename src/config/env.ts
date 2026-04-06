// import dotenv from 'dotenv';

// dotenv.config();

// export const config = {
//   env: process.env.NODE_ENV || 'development',
//   port: parseInt(process.env.PORT || '3000', 10),
//   database: {
//     host: process.env.DB_HOST || 'localhost',
//     port: parseInt(process.env.DB_PORT || '5432', 10),
//     name: process.env.DB_NAME || 'sums_db',
//     user: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || 'password',
//     dialect: 'postgres' as const
//   },
//   jwt: {
//     secret: process.env.JWT_SECRET || 'your_super_secret_key_here',
//     expiresIn: process.env.JWT_EXPIRES_IN || '24h'
//   },
//   telebirr: {
//     apiUrl: process.env.TELEBIRR_API_URL || 'https://api.telebirr.et',
//     appId: process.env.TELEBIRR_APP_ID || '',
//     appKey: process.env.TELEBIRR_APP_KEY || ''
//   },
//   cors: {
//     origin: (process.env.CORS_ORIGIN || 'http://localhost:3001').split(',')
//   },
//   redis: {
//     host: process.env.REDIS_HOST || 'localhost',
//     port: parseInt(process.env.REDIS_PORT || '6379', 10)
//   },
//   logging: {
//     level: process.env.LOG_LEVEL || 'debug',
//     format: process.env.LOG_FORMAT || 'json'
//   }
// };

// export default config;
