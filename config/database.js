const dotenv = require('dotenv');

dotenv.config();

const databaseUrl = process.env.DATABASE_URL || '';

const shouldUseSsl = (() => {
  if (!databaseUrl) {
    return false;
  }
  try {
    const parsed = new URL(databaseUrl);
    const sslMode = (parsed.searchParams.get('sslmode') || '').toLowerCase();
    return sslMode === 'require' || sslMode === 'verify-ca' || sslMode === 'verify-full';
  } catch {
    return false;
  }
})();

const baseConfig = {
  url: databaseUrl,
  dialect: 'postgres',
  logging: false,
  dialectOptions: shouldUseSsl
    ? {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
    : undefined
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig
};
