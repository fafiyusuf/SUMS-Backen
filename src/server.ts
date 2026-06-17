import dns from "dns";
import 'dotenv/config';
import http from 'http';
import app from './app';
import { sequelize } from './config/database';
import config from './config/env';
import { initializeAssociations } from './database/connection';
import './queues/persistenceWorker'; // Start persistence worker
import logger from './utils/logger';
import { seedAdamaData } from './utils/seedData';
import socketServer from './websocket/socketServer';

dns.setDefaultResultOrder("ipv4first");
const PORT = config.port || 3000;

async function startServer() {
  console.log('--- Server Startup Initiated ---');
  try {
    // 1. Initialize database associations
    console.log('1. Initializing associations...');
    initializeAssociations();

    // 2. Test database connection
    console.log('2. Authenticating database...');
    await sequelize.authenticate();
    logger.info('Database connection established successfully');

    // 3. Sync database (Create/Update tables) - MUST happen before seeding
    console.log('3. Syncing database (alter enabled)...');
    await sequelize.sync({ alter: true });
    logger.info('Database synchronized (schema updated)');

    // 4. Create HTTP server and initialize WebSockets
    console.log('4. Initializing HTTP & Socket server...');
    const server = http.createServer(app);
    socketServer.initialize(server);

    // 5. Seed Adama Data
    console.log('5. Seeding Adama data...');
    await seedAdamaData();

    // 6. Start LocationService
    console.log('6. Starting LocationService...');
    const { default: locationService } = await import('./services/LocationService');
    await locationService.start();
    logger.info('LocationService started and simulation loop running');

    // 7. Start listening
    console.log(`7. Attempting to listen on port ${PORT}...`);
    server.listen(PORT, () => {
      console.log(`🚀 SERVER READY ON PORT ${PORT}`);
      logger.info(`Server running on port ${PORT}`);
    });
  } catch (error) {
    logger.error(`Server startup failed: ${error}`);
    process.exit(1);
  }
}

// Start the server
startServer();
