import express from 'express';
import cardController from '../controllers/cardController';
import verifyToken from '../middleware/authMiddleware';
import requireRole from '../middleware/roleMiddleware';
import {
  validateActivateCard,
  validateLinkTelebirr,
  validateCardIdParam,
  validatePagination
} from '../middleware/card.validation';
import { body } from 'express-validator';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: Card management
 *
 * /cards/activate:
 *   post:
 *     summary: Passenger activates a card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cardNumber:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card activated
 *
 * /cards/my-card:
 *   get:
 *     summary: Get current passenger's card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Card object
 *
 * /cards/link-telebirr:
 *   put:
 *     summary: Link telebirr account to passenger card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               telebirrId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Linked
 *
 * /cards:
 *   get:
 *     summary: Admin list cards
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of cards
 *
 * /cards/{cardId}:
 *   get:
 *     summary: Admin get card by id
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Card object
 *
 * /cards/{cardId}/status:
 *   put:
 *     summary: Admin update card status
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: Status updated
 */

// Passenger: activate card
router.post('/activate', verifyToken, requireRole('passenger'), validateActivateCard, cardController.activate.bind(cardController));

// Passenger: get my card
router.get('/my-card', verifyToken, requireRole('passenger'), cardController.myCard.bind(cardController));

// Passenger: link telebirr
router.put('/link-telebirr', verifyToken, requireRole('passenger'), validateLinkTelebirr, cardController.linkTelebirr.bind(cardController));

// Admin: list cards
router.get('/', verifyToken, requireRole('admin'), validatePagination, cardController.list.bind(cardController));

// Admin: get card
router.get('/:cardId', verifyToken, requireRole('admin'), validateCardIdParam, cardController.getById.bind(cardController));

// Admin: update status
router.put('/:cardId/status', verifyToken, requireRole('admin'), [body('status').isIn(['ACTIVE','SUSPENDED'])], cardController.updateStatus.bind(cardController));

export default router;
