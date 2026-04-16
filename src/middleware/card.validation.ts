import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../utils/validators';

export const validateActivateCard = [
  body('cardId').isString().trim().notEmpty().withMessage('cardId is required'),
  handleValidationErrors
];

export const validateLinkTelebirr = [
  body('phone')
    .isMobilePhone('any')
    .withMessage('Please provide a valid phone number'),
  handleValidationErrors
];

export const validateCardIdParam = [
  param('cardId').isString().trim().notEmpty().withMessage('cardId is required'),
  handleValidationErrors
];

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  handleValidationErrors
];
