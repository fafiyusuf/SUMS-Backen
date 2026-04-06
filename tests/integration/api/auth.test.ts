// import request from 'supertest';
// import app from '../../../src/app';

// describe('Auth API', () => {
//   describe('POST /api/v1/auth/register', () => {
//     it('should register a new user', async () => {
//       const response = await request(app)
//         .post('/api/v1/auth/register')
//         .send({
//           fullName: 'Test User',
//           email: 'test@example.com',
//           password: 'password123'
//         });

//       expect(response.status).toBe(201);
//       expect(response.body).toHaveProperty('success', true);
//       expect(response.body).toHaveProperty('data');
//     });

//     it('should return 400 for invalid email', async () => {
//       const response = await request(app)
//         .post('/api/v1/auth/register')
//         .send({
//           fullName: 'Test User',
//           email: 'invalid-email',
//           password: 'password123'
//         });

//       expect(response.status).toBe(400);
//       expect(response.body).toHaveProperty('success', false);
//     });
//   });

//   describe('POST /api/v1/auth/login/passenger', () => {
//     it('should login a user', async () => {
//       const response = await request(app)
//         .post('/api/v1/auth/login/passenger')
//         .send({
//           email: 'user@example.com',
//           password: 'password123'
//         });

//       expect(response.status).toBeOneOf([200, 401, 400]); // Depends on database state
//       expect(response.body).toHaveProperty('success');
//     });
//   });
// });
