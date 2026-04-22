# SUMS Backend - Complete TypeScript MVC Architecture

## 📁 Project Structure Overview

```
SUMS-Backend/
│
├── src/
│   ├── config/                          # Configuration files
│   │   ├── env.ts                       # Environment variables
│   │   ├── database.ts                  # Database connection config
│   │   ├── jwt.ts                       # JWT configuration
│   │   └── telebirr.ts                  # Telebirr API config
│   │
│   ├── models/                          # Sequelize Models (Data Layer)
│   │   ├── User.ts                      # User model with role enum
│   │   ├── SmartCard.ts                 # Smart card model
│   │   ├── Wallet.ts                    # Wallet model
│   │   ├── Transaction.ts               # Transaction model
│   │   ├── Bus.ts                       # Bus model
│   │   ├── Route.ts                     # Route model
│   │   ├── Stop.ts                      # Bus stop model
│   │   ├── Trip.ts                      # Trip model
│   │   ├── TapEvent.ts                  # Card tap events
│   │   ├── GPSCoordinate.ts             # GPS tracking
│   │   ├── Incident.ts                  # Incident reports
│   │   ├── Schedule.ts                  # Route schedule
│   │   └── index.ts                     # Export all models
│   │
│   ├── controllers/                     # Controllers (Request Handlers)
│   │   ├── authController.ts            # Auth operations
│   │   ├── walletController.ts          # Wallet operations
│   │   ├── tripController.ts            # Trip management
│   │   ├── busController.ts             # Bus management
│   │   ├── routeController.ts           # Route management
│   │   ├── stopController.ts            # Stop management
│   │   ├── gpsController.ts             # GPS tracking
│   │   └── incidentController.ts        # Incident management
│   │
│   ├── routes/                          # Route Definitions (API Endpoints)
│   │   ├── authRoutes.ts                # /api/v1/auth
│   │   ├── walletRoutes.ts              # /api/v1/wallet
│   │   ├── tripRoutes.ts                # /api/v1/trips
│   │   ├── busRoutes.ts                 # /api/v1/buses
│   │   ├── routeRoutes.ts               # /api/v1/routes
│   │   ├── stopRoutes.ts                # /api/v1/stops
│   │   ├── gpsRoutes.ts                 # /api/v1/gps
│   │   ├── incidentRoutes.ts            # /api/v1/incidents
│   │   └── index.ts                     # Combine all routes
│   │
│   ├── services/                        # Services (Business Logic)
│   │   ├── authService.ts               # Authentication logic
│   │   ├── walletService.ts             # Wallet operations
│   │   ├── telebirrService.ts           # Payment integration
│   │   ├── fareService.ts               # Fare calculation
│   │   ├── etaService.ts                # ETA calculation
│   │   ├── notificationService.ts       # Notifications
│   │   ├── emailService.ts              # Email operations
│   │   └── analyticsService.ts          # Analytics operations
│   │
│   ├── middleware/                      # Express Middleware
│   │   ├── authMiddleware.ts            # JWT verification
│   │   ├── roleMiddleware.ts            # Role-based access control
│   │   ├── validationMiddleware.ts      # Request validation
│   │   ├── errorHandler.ts              # Global error handler
│   │   └── rateLimiter.ts               # Rate limiting
│   │
│   ├── websocket/                       # WebSocket Real-time Features
│   │   ├── socketServer.ts              # Socket.io setup
│   │   ├── events.ts                    # WebSocket event constants
│   │   └── handlers/
│   │       ├── gpsHandler.ts            # GPS updates
│   │       ├── etaHandler.ts            # ETA broadcasts
│   │       └── incidentHandler.ts       # Incident alerts
│   │
│   ├── database/                        # Database Management
│   │   ├── connection.ts                # Model associations
│   │   ├── migrations/
│   │   │   └── 001-create-users.js      # Migration example
│   │   └── seeders/
│   │       └── 001-seed-users.js        # Seed data example
│   │
│   ├── utils/                           # Utility Functions
│   │   ├── logger.ts                    # Winston logger
│   │   ├── helpers.ts                   # Helper functions
│   │   ├── constants.ts                 # App constants
│   │   └── validators.ts                # Validation schemas
│   │
│   ├── app.ts                           # Express app setup
│   └── server.ts                        # Server entry point
│
├── tests/                               # Test Suite
│   ├── unit/
│   │   ├── models/                      # Model tests
│   │   ├── controllers/                 # Controller tests
│   │   └── services/
│   │       └── authService.test.ts      # Auth service tests
│   └── integration/
│       └── api/
│           └── auth.test.ts             # API integration tests
│
├── config/
│   └── database.json                    # Sequelize CLI config
│
├── .env                                 # Environment variables (local)
├── .env.example                         # Environment template
├── .gitignore                           # Git ignore rules
├── .sequelizerc                         # Sequelize CLI config
├── tsconfig.json                        # TypeScript config
├── jest.config.js                       # Jest test config
├── nodemon.json                         # Nodemon dev config
├── package.json                         # Dependencies & scripts
├── README.md                            # Project documentation
└── STRUCTURE.md                         # This file

```

## 🏗️ Architecture Pattern - MVC (Model-View-Controller)

### 1. **Models** (Data Layer)
- Sequelize ORM models
- Database schemas and relationships
- Data validation
- File: `src/models/*.ts`

### 2. **Controllers** (Request Handler Layer)
- HTTP request processing
- Input validation coordination
- Service orchestration
- Response formatting
- File: `src/controllers/*.ts`

### 3. **Routes** (API Endpoint Layer)
- URL routing
- HTTP method mapping
- Middleware attachment
- File: `src/routes/*.ts`

### 4. **Services** (Business Logic Layer)
- Complex business logic
- External API integration
- Data processing
- File: `src/services/*.ts`

### 5. **Middleware** (Cross-cutting Concern Layer)
- Authentication
- Authorization
- Validation
- Error handling
- File: `src/middleware/*.ts`

## 📊 Data Models & Relationships

```
User (1) ──── (1) Wallet
  │
  ├──── (M) SmartCard
  │
  ├──── (M) Trip
  │
  ├──── (M) Transaction
  │
  ├──── (M) TapEvent
  │
  └──── (M) Incident (reportedBy)

Bus (1) ──── (M) Trip
  │
  ├──── (M) GPSCoordinate
  │
  ├──── (M) TapEvent
  │
  ├──── (M) Incident
  │
  └──── (M) Schedule

Route (1) ──── (M) Bus
   │
   ├──── (M) Stop
   │
   ├──── (M) Trip
   │
   └──── (M) Schedule

Stop (1) ──── (M) Trip (startStop, endStop)
  │
  └──── (M) TapEvent

SmartCard (1) ──── (M) TapEvent

Schedule (M) ──── (1) Route
     │
     └──── (1) Bus
```

## 🔄 Request Flow

```
HTTP Request
    ↓
Middleware Stack (Auth, Validation, Rate Limit)
    ↓
Router (Route Matching)
    ↓
Controller (Request Handler)
    ↓
Service (Business Logic)
    ↓
Model (Database Operation)
    ↓
Response (JSON)
```

## 🔐 Security Layers

1. **Rate Limiting** - Prevent abuse
2. **CORS** - Cross-origin requests
3. **Helmet** - Security headers
4. **JWT Authentication** - Token-based auth
5. **Role-based Authorization** - Permission checks
6. **Input Validation** - Data sanitization
7. **Error Handler** - Safe error messages

## 📦 Dependencies Overview

### Core
- `express` - Web framework
- `sequelize` - ORM
- `pg` - PostgreSQL driver

### Authentication
- `jsonwebtoken` - JWT handling
- `bcrypt` - Password hashing

### Real-time
- `socket.io` - WebSocket

### Utilities
- `dotenv` - Environment variables
- `morgan` - HTTP logging
- `winston` - Application logging
- `axios` - HTTP client
- `express-validator` - Input validation

### Development
- `typescript` - Type safety
- `ts-node` - TypeScript execution
- `nodemon` - Auto-reload
- `jest` - Testing
- `supertest` - API testing

## 🚀 API Endpoints Summary

### Authentication
- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login/passenger`
- `POST /api/v1/auth/login/driver`
- `POST /api/v1/auth/login/admin`
- `POST /api/v1/auth/refresh-token`
- `POST /api/v1/auth/logout`

### Wallet
- `GET /api/v1/wallet/balance`
- `POST /api/v1/wallet/add-balance`
- `GET /api/v1/wallet/transactions`

### Trips
- `POST /api/v1/trips`
- `GET /api/v1/trips/:id`
- `GET /api/v1/trips/user/:userId`
- `PUT /api/v1/trips/:id/complete`
- `PUT /api/v1/trips/:id/cancel`

### Buses
- `POST /api/v1/buses` (Admin only)
- `GET /api/v1/buses`
- `GET /api/v1/buses/:id`
- `PUT /api/v1/buses/:id`
- `DELETE /api/v1/buses/:id`

### Routes
- `POST /api/v1/routes` (Admin only)
- `GET /api/v1/routes`
- `GET /api/v1/routes/:id`
- `PUT /api/v1/routes/:id`
- `DELETE /api/v1/routes/:id`

### Stops
- `POST /api/v1/stops` (Admin only)
- `GET /api/v1/stops/:id`
- `GET /api/v1/stops/route/:routeId`
- `PUT /api/v1/stops/:id`
- `DELETE /api/v1/stops/:id`

### GPS
- `POST /api/v1/gps/record` (Driver only)
- `GET /api/v1/gps/latest/:busId`
- `GET /api/v1/gps/track/:busId`

### Incidents
- `POST /api/v1/incidents`
- `GET /api/v1/incidents/:id`
- `GET /api/v1/incidents`
- `PUT /api/v1/incidents/:id/status`

## 🧪 Testing Structure

```
tests/
├── unit/                    # Unit tests
│   ├── models/             # Model tests
│   ├── controllers/        # Controller tests
│   └── services/           # Service tests
└── integration/            # Integration tests
    └── api/               # API endpoint tests
```

## 📋 Environment Variables

Required variables in `.env`:
```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sums_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3001
TELEBIRR_API_URL=https://api.telebirr.et
TELEBIRR_APP_ID=your_app_id
TELEBIRR_APP_KEY=your_app_key
```

## 🎯 Development Workflow

1. **Setup**
   ```bash
   npm install
   npm run build
   ```

2. **Development**
   ```bash
   npm run dev
   ```

3. **Testing**
   ```bash
   npm test
   npm run test:coverage
   ```

4. **Production Build**
   ```bash
   npm run build
   npm start
   ```

## 📝 Key Files Explained

| File | Purpose |
|------|---------|
| `server.ts` | Entry point, initializes server & DB |
| `app.ts` | Express app configuration |
| `routes/index.ts` | All routes combined |
| `middleware/errorHandler.ts` | Global error handling |
| `models/index.ts` | All models exported |
| `services/*.ts` | Business logic isolated |
| `websocket/socketServer.ts` | Real-time updates |

## 🔗 Best Practices Implemented

✅ Separation of concerns (MVC pattern)
✅ Type safety (TypeScript)
✅ Error handling (try-catch, error middleware)
✅ Input validation (Express Validator)
✅ Authentication & Authorization (JWT, Role-based)
✅ Logging (Winston)
✅ Rate limiting
✅ Environment configuration
✅ Database relationships
✅ API versioning (/api/v1)
✅ WebSocket real-time features
✅ Middleware pipeline

## 🚀 Future Enhancements

- [ ] Cache layer (Redis)
- [ ] Message queue (RabbitMQ)
- [ ] API documentation (Swagger)
- [ ] GraphQL support
- [ ] Microservices migration
- [ ] Database replication
- [ ] CI/CD pipeline
- [ ] Monitoring & alerting

---

**Last Updated**: April 2026
**Version**: 1.0.0
**Status**: Production Ready ✅
