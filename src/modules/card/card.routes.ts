import express from 'express';
import verifyToken from '../../middleware/authMiddleware';
import requireRole from '../../middleware/roleMiddleware';
import validate from '../../middleware/validate';
import cardController from './card.controller';
import {
    activateCardSchema,
    cardIdParamSchema,
    linkTelebirrSchema,
    listCardsSchema,
    updateCardStatusSchema
} from './card.schema';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Cards
 *   description: NFC/Smart Card management API
 */

/**
 * @swagger
 * /cards/activate:
 *   post:
 *     summary: Activate a new smart card
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardId
 *             properties:
 *               cardId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Card activated
 *       400:
 *         description: Validation error or card already in use
 */

router.post('/activate', verifyToken, requireRole('passenger'), validate(activateCardSchema), cardController.activate);

/**
 * @swagger
 * /cards/my-card:
 *   get:
 *     summary: Get my card details
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Card details
 *       404:
 *         description: Card not found
 */

router.get('/my-card', verifyToken, requireRole('passenger'), cardController.myCard);

/**
 * @swagger
 * /cards/link-telebirr:
 *   put:
 *     summary: Link a card to a Telebirr account via phone
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Telebirr account linked
 *       400:
 *         description: Validation error
 */

router.put('/link-telebirr', verifyToken, requireRole('passenger'), validate(linkTelebirrSchema), cardController.linkTelebirr);

/**
 * @swagger
 * /cards:
 *   get:
 *     summary: Get all cards (Admin)
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Items per page
 *     responses:
 *       200:
 *         description: List of cards
 */

router.get('/', verifyToken, requireRole('admin'), validate(listCardsSchema), cardController.list);

/**
 * @swagger
 * /cards/{cardId}:
 *   get:
 *     summary: Get a card by ID (Admin)
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     responses:
 *       200:
 *         description: Card details
 *       404:
 *         description: Card not found
 */

router.get('/:cardId', verifyToken, requireRole('admin'), validate(cardIdParamSchema), cardController.getById);

/**
 * @swagger
 * /cards/{cardId}/status:
 *   put:
 *     summary: Update a card's status (Admin)
 *     tags: [Cards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: cardId
 *         required: true
 *         schema:
 *           type: string
 *         description: Card ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: Card status updated
 *       404:
 *         description: Card not found
 */

router.put('/:cardId/status', verifyToken, requireRole('admin'), validate(updateCardStatusSchema), cardController.updateStatus);

export default router;
