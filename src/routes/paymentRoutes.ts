import express, { Request, Response, NextFunction } from 'express';
import walletController from '../controllers/walletController';

const router = express.Router();

/**
 * @swagger
 * /payment/success:
 *   get:
 *     summary: Handle payment success redirect from Telebirr
 *     tags: [Payment]
 *     parameters:
 *       - in: query
 *         name: tradeNo
 *         required: true
 *         schema:
 *           type: string
 *           description: Transaction number from Telebirr
 *     responses:
 *       200:
 *         description: Payment verification result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 transaction:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     amount:
 *                       type: number
 *                     status:
 *                       type: string
 *       400:
 *         description: Transaction number required
 */
router.get('/success', 
  (req: Request, res: Response, next: NextFunction) =>
    walletController.telebirrVerify(req, res, next)
);

export default router;
