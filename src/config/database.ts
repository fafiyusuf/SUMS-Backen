import { Options, Sequelize } from 'sequelize';
import config from './env';

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

const parsedDatabaseUrl = (() => {
  try {
    return new URL(config.databaseUrl);
  } catch {
    return null;
  }
})();

const sslMode = parsedDatabaseUrl?.searchParams.get('sslmode')?.toLowerCase() || '';
const shouldUseSsl =
  config.env === 'production' ||
  config.env === 'staging' ||
  sslMode === 'require' ||
  sslMode === 'verify-ca' ||
  sslMode === 'verify-full';

const sequelizeConfig: Options = {
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  dialectOptions: shouldUseSsl
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    : undefined,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
};

export const sequelize = new Sequelize(config.databaseUrl, sequelizeConfig);

export default sequelizeConfig;
