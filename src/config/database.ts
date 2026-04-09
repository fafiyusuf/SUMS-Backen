import { Sequelize, Options } from 'sequelize';
import config from './env';

if (!config.databaseUrl) {
  throw new Error("DATABASE_URL is not set in the environment variables.");
}

const sequelizeConfig: Options = {
  dialect: 'postgres',
  logging: config.env === 'development' ? console.log : false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
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
