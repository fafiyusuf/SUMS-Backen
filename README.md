# SUMS Backend - Smart Urban Mobility System

TypeScript backend for the Smart Urban Mobility System with Express.js, Sequelize ORM, and WebSocket support.

## 🚀 Features

- **User Management**: Authentication, authorization, and role-based access control
- **Wallet System**: Balance management and transaction tracking
- **Trip Management**: Create, track, and complete trips
- **Real-time GPS**: Live bus location tracking via WebSocket
- **ETA Calculation**: Accurate estimated time of arrival
- **Incident Reporting**: Report and track incidents
- **Telebirr Integration**: Payment processing via Telebirr API
- **WebSocket Support**: Real-time updates for GPS, ETA, and incidents

## 📋 Prerequisites

- Node.js 16+ or higher
- PostgreSQL 12+
- npm or yarn

## 🛠️ Installation

1. Clone the repository
```bash
git clone <repository-url>
cd sums-backend
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=sums_db
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=your_super_secret_key_here
```

4. Create database
```bash
createdb sums_db
```

## 📦 Project Structure

```
src/
├── config/              # Configuration files
├── controllers/         # Request handlers
├── models/              # Database models
├── routes/              # API routes
├── services/            # Business logic
├── middleware/          # Express middleware
├── websocket/           # WebSocket handlers
├── database/            # Database utilities
├── utils/               # Helper functions
├── app.ts               # Express app setup
└── server.ts            # Server entry point
```

## 🚀 Getting Started

### Development
```bash
npm run dev
```

Server runs on `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Run Tests
```bash
npm test
npm run test:watch
npm run test:coverage
```

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### Register
```
POST /auth/register
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+251900000000",
  "password": "password123"
}
```

#### Login
```
POST /auth/login/passenger
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "user": {
      "id": "uuid",
      "email": "john@example.com",
      "fullName": "John Doe",
      "role": "passenger"
    }
  }
}
```

### Wallet Endpoints

#### Get Wallet Balance
```
GET /wallet/balance
Authorization: Bearer <token>
```

#### Add Balance
```
POST /wallet/add-balance
Authorization: Bearer <token>
Content-Type: application/json

{
  "amount": 100.00
}
```

#### Get Transaction History
```
GET /wallet/transactions?page=1&limit=10
Authorization: Bearer <token>
```

### Trip Endpoints

#### Create Trip
```
POST /trips
Authorization: Bearer <token>
Content-Type: application/json

{
  "userId": "uuid",
  "busId": "uuid",
  "routeId": "uuid",
  "startStopId": "uuid",
  "endStopId": "uuid",
  "fare": 25.50
}
```

#### Get User Trips
```
GET /trips/user/:userId?page=1&limit=10
Authorization: Bearer <token>
```

#### Complete Trip
```
PUT /trips/:id/complete
Authorization: Bearer <token>
Content-Type: application/json

{
  "endStopId": "uuid"
}
```

### GPS Endpoints

#### Record GPS Data
```
POST /gps/record
Authorization: Bearer <token>
Content-Type: application/json

{
  "busId": "uuid",
  "latitude": 9.0320,
  "longitude": 38.7469,
  "accuracy": 5.0,
  "speed": 45.5,
  "heading": 180
}
```

#### Get Latest GPS
```
GET /gps/latest/:busId
```

## 🔐 Database Models

### User
- Passenger, Driver, Admin roles
- Status tracking (active, suspended, inactive)

### SmartCard
- Linked to user account
- Unique card ID for tap events

### Wallet
- Balance management
- Currency support (ETB)

### Trip
- Trip details with status
- Start and end stops
- Fare calculation

### Bus
- Registration and capacity tracking
- Route assignment
- Current passenger count

### Route
- Route name and stops
- Distance and estimated duration

### Stop
- Stop location with coordinates
- Sequence number for ordering

## 🔌 WebSocket Events

### GPS Events
```javascript
socket.emit('gps:update', { busId, latitude, longitude, ... });
socket.on('gps:updated', (data) => { ... });
```

### ETA Events
```javascript
socket.emit('eta:request', { busId, destination });
socket.on('eta:response', (data) => { ... });
```

### Incident Events
```javascript
socket.emit('incident:report', { busId, type, severity, description });
socket.on('incident:reported', (data) => { ... });
```

## 📝 Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| NODE_ENV | development | Environment mode |
| PORT | 3000 | Server port |
| DB_HOST | localhost | Database host |
| DB_PORT | 5432 | Database port |
| DB_NAME | sums_db | Database name |
| JWT_SECRET | - | JWT secret key |
| CORS_ORIGIN | http://localhost:3001 | CORS origin |
| LOG_LEVEL | debug | Logging level |

## 🧪 Testing

### Unit Tests
```bash
npm test -- tests/unit
```

### Integration Tests
```bash
npm test -- tests/integration
```

### Coverage Report
```bash
npm run test:coverage
```

## 📋 Database Migrations

### Create Migration
```bash
npx sequelize-cli migration:create --name migration-name
```

### Run Migrations
```bash
npm run migrate
```

### Undo Migration
```bash
npm run migrate:undo
```

### Seed Database
```bash
npm run seed
```

## 🚨 Error Handling

Common HTTP Status Codes:
- `200`: Success
- `201`: Resource created
- `400`: Bad request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not found
- `429`: Too many requests
- `500`: Server error

## 🔄 Data Flow

1. **Request** → Middleware (Auth, Validation) → Controller
2. **Controller** → Service (Business Logic)
3. **Service** → Model (Database Operations)
4. **Response** → JSON with status and data

## 📚 Additional Resources

- [Express Documentation](https://expressjs.com)
- [Sequelize ORM](https://sequelize.org)
- [Socket.io Documentation](https://socket.io)
- [JWT Authentication](https://jwt.io)

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Add tests
4. Submit a pull request

## 📄 License

ISC

## 👥 Authors

SUMS Development Team

## 📞 Support

For support, email: support@sums.et or create an issue in the repository.
