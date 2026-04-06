// import 'dotenv/config';
// import http from 'http';
// import app from './app';
// import { sequelize } from './config/database';
// import config from './config/env';
// import { initializeAssociations } from './database/connection';
// import logger from './utils/logger';
// import socketServer from './websocket/socketServer';

// const PORT = config.port || 3000;

// async function startServer() {
//   try {
//     // Initialize database associations
//     initializeAssociations();

//     // Test database connection
//     await sequelize.authenticate();
//     logger.info('Database connection established successfully');

//     // Sync database (use { alter: true } in development, migrations in production)
//     if (config.env === 'development') {
//       await sequelize.sync({ alter: true });
//       logger.info('Database synchronized');
//     }

//     // Create HTTP server
//     const server = http.createServer(app);

//     // Initialize WebSocket server
//     socketServer.initialize(server);

//     // Start server
//     server.listen(PORT, () => {
//       logger.info(`Server running on port ${PORT}`);
//       logger.info(`Environment: ${config.env}`);
//     });
//   } catch (error) {
//     logger.error(`Server startup failed: ${error}`);
//     process.exit(1);
//   }
// }

// // Start the server
// startServer();
