import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
dotenv.config();

const PORT = process.env.PORT || 3000;

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'SUMS Backend API',
      version: '1.0.0',
      description: 'API documentation for the Smart Urban Mobility System (SUMS)',
    },
    servers: [
      {
        url: `http://localhost:${PORT}/api/v1`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/modules/**/*.routes.ts', './src/modules/**/*.model.ts', './src/routes.ts'], // Generate docs from JSDoc comments in routes and models
};

export const swaggerSpec = swaggerJsdoc(options);
