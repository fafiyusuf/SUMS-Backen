import { sequelize } from './config/database';

async function fix() {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        // Make end_stop_id nullable in trips table
        await sequelize.query('ALTER TABLE trips ALTER COLUMN end_stop_id DROP NOT NULL;');
        console.log('Fixed end_stop_id constraint');

        // Make fare nullable or default 0
        await sequelize.query('ALTER TABLE trips ALTER COLUMN fare SET DEFAULT 0;');

        process.exit(0);
    } catch (err) {
        console.error('Fix failed:', err);
        process.exit(1);
    }
}

fix();
