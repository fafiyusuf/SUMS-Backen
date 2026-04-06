// import { User } from '../../../src/models';
// import authService from '../../../src/services/authService';

// describe('AuthService', () => {
//   describe('registerUser', () => {
//     it('should successfully register a new user', async () => {
//       const userData = {
//         fullName: 'John Doe',
//         email: 'john@example.com',
//         password: 'password123'
//       };

//       // Mock the User.create method
//       jest.spyOn(User, 'create').mockResolvedValue({
//         id: '123',
//         fullName: userData.fullName,
//         email: userData.email,
//         password: userData.password,
//         role: 'passenger',
//         status: 'active'
//       } as any);

//       const result = await authService.registerUser(userData);

//       expect(result).toHaveProperty('userId');
//       expect(result).toHaveProperty('email');
//       expect(result.email).toBe(userData.email);
//     });

//     it('should throw error if user already exists', async () => {
//       const userData = {
//         fullName: 'John Doe',
//         email: 'existing@example.com',
//         password: 'password123'
//       };

//       jest.spyOn(User, 'findOne').mockResolvedValue({} as any);

//       await expect(authService.registerUser(userData)).rejects.toThrow('User already exists');
//     });
//   });

//   describe('loginUser', () => {
//     it('should successfully login a user', async () => {
//       const email = 'user@example.com';
//       const password = 'password123';

//       jest.spyOn(User, 'findOne').mockResolvedValue({
//         id: '123',
//         email,
//         password: '$2b$10$hashedpassword',
//         role: 'passenger',
//         status: 'active'
//       } as any);

//       jest.spyOn(require('bcrypt'), 'compare').mockResolvedValue(true);

//       const result = await authService.loginUser(email, password);

//       expect(result).toHaveProperty('token');
//       expect(result).toHaveProperty('user');
//       expect(result.user.email).toBe(email);
//     });

//     it('should throw error for invalid credentials', async () => {
//       jest.spyOn(User, 'findOne').mockResolvedValue(null);

//       await expect(authService.loginUser('wrong@example.com', 'password')).rejects.toThrow('Invalid credentials');
//     });
//   });
// });
