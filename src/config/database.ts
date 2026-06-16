import { Options, Sequelize } from 'sequelize';
import config from './env';

const databaseUrl = config.databaseUrl;

const sequelizeConfig: Options = {
  dialect: 'postgres',
  logging: false, // Only log errors if needed, disabled by default for cleaner terminal
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    },
    connectTimeout: 30000 // 30 seconds is a good balance
  },
  pool: {
    max: 10,
    min: 1,
    acquire: 60000,
    idle: 10000
  },
  define: {
    timestamps: true,
    underscored: true
  }
};

export const sequelize = new Sequelize(databaseUrl, sequelizeConfig);

export default sequelizeConfig;
