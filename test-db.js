const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;
console.log('Testing connection to:', databaseUrl.split('@')[1]); // Log host part only

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function test() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
        const result = await sequelize.query('SELECT current_database(), current_user, now();');
        console.log('Query result:', result[0]);
        process.exit(0);
    } catch (error) {
        console.error('Unable to connect to the database:', error);
        process.exit(1);
    }
}

test();
