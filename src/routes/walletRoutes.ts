// import express from 'express';
// import walletController from '../controllers/walletController';
// import verifyToken from '../middleware/authMiddleware';
// 
// const router = express.Router();
// 
// // All routes require authentication
// router.get('/balance', verifyToken, (req, res, next) =>
//   walletController.getWallet(req, res, next)
// );
// 
// router.post('/add-balance', verifyToken, (req, res, next) =>
//   walletController.addBalance(req, res, next)
// );
// 
// router.get('/transactions', verifyToken, (req, res, next) =>
//   walletController.getTransactionHistory(req, res, next)
// );
// 
// export default router;
