const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
dotenv.config();

const databaseUrl = process.env.DATABASE_URL;

const sequelize = new Sequelize(databaseUrl, {
    dialect: 'postgres',
    dialectOptions: {
        ssl: {
            require: true,
            rejectUnauthorized: false
        }
    }
});

async function sync() {
    try {
        console.log('Synchronizing schema manually...');

        // Check if route_type exists in routes table
        const [results] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'routes' AND column_name = 'route_type';
    `);

        if (results.length === 0) {
            console.log('Adding route_type and simulation_enabled to routes table...');

            // We need to create the ENUM type first if it doesn't exist
            await sequelize.query(`
        DO $$ BEGIN
          IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'enum_routes_route_type') THEN
            CREATE TYPE enum_routes_route_type AS ENUM('operational', 'simulation', 'test');
          END IF;
        END $$;
      `);

            await sequelize.query(`
        ALTER TABLE routes 
        ADD COLUMN IF NOT EXISTS route_type enum_routes_route_type DEFAULT 'operational',
        ADD COLUMN IF NOT EXISTS simulation_enabled BOOLEAN DEFAULT false;
      `);
            console.log('Updated routes table.');
        } else {
            console.log('routes table already has route_type.');
        }

        // Check trips table for is_simulation
        const [tripResults] = await sequelize.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = 'trips' AND column_name = 'is_simulation';
    `);

        if (tripResults.length === 0) {
            console.log('Adding is_simulation to trips table...');
            await sequelize.query(`
        ALTER TABLE trips 
        ADD COLUMN IF NOT EXISTS is_simulation BOOLEAN DEFAULT false;
      `);
            console.log('Updated trips table.');
        } else {
            console.log('trips table already has is_simulation.');
        }

        console.log('Schema synchronization complete.');
        process.exit(0);
    } catch (error) {
        console.error('Synchronization failed:', error);
        process.exit(1);
    }
}

sync();
