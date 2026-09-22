import dotenv from 'dotenv';

dotenv.config();

export const config = {
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'your_super_secret_key_here',
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'refresh_secret_here',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d'
  },
  telebirr: {
    apiUrl: process.env.TELEBIRR_API_URL || 'https://api.telebirr.et',
    appId: process.env.TELEBIRR_APP_ID || process.env.Fabric_App_ID || process.env.FABRIC_APP_ID || '',
    appKey: process.env.TELEBIRR_APP_KEY || '',
    fabricAppId: process.env.FABRIC_APP_ID || process.env.Fabric_App_ID || process.env.TELEBIRR_APP_ID || '',
    appSecret: process.env.APP_SECRET || process.env.App_Secret || '',
    merchantCode: process.env.MERCHANT_CODE || process.env.ShortCode || '',
    merchantAppId: process.env.MERCHANT_APP_ID || process.env.Merchant_AppID || '',
    privateKey: process.env.PRIVATE_KEY || process.env.PrivateKey || '',
    tokenUrl: process.env.TELEBIRR_TOKEN_URL || '',
    createOrderUrl: process.env.TELEBIRR_CREATE_ORDER_URL || '',
    checkoutBaseUrl: process.env.TELEBIRR_CHECKOUT_BASE_URL || ''
  },
  cors: {
    origin: (process.env.CORS_ORIGIN || 'http://localhost:3000,http://localhost:5173')
      .split(',')
      .map(o => o.trim().replace(/^["']|["']$/g, '').replace(/\/$/, ''))
      .filter(Boolean)
  },
  redis: {
    url: process.env.REDIS_URL || '',
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10)
  },
  logging: {
    level: process.env.LOG_LEVEL || 'debug',
    format: process.env.LOG_FORMAT || 'json'
  },
  receipt: {
    receiverName: process.env.TELEBIRR_RECEIVER_NAME || '',
    receiverPhone: process.env.TELEBIRR_RECEIVER_PHONE || ''
  }
};

// Validate require environment variables for Production
if (config.env === 'production') {
  if (!config.redis.url) {
    throw new Error('FATAL ERROR: REDIS_URL environment variable is missing in production. Ensure Render environment variables are properly configured.');
  }
}

export default config;
