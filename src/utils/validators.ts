import { NextFunction, Request, Response } from 'express';
import { body, param, query, validationResult } from 'express-validator';

export const validateRegister = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    .trim().escape(),
  body('fullName')
    .notEmpty().withMessage('Full name is required')
    .trim().escape(),
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('any').withMessage('Please provide a valid phone number')
];

export const validateCreateDriver = [
  ...validateRegister,
  body('licenseNumber')
    .notEmpty().withMessage('License number is required')
    .trim().escape()
];

export const validateLogin = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isMobilePhone('any').withMessage('Please provide a valid phone number'),
  body('password')
    .notEmpty().withMessage('Password is required')
    .escape()
];

export const validateCreateTransaction = [
  body('userId').isUUID().withMessage('Invalid User ID format'),
  body('type').isIn(['debit', 'credit']).withMessage('Transaction type must be either debit or credit'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('description').notEmpty().withMessage('Description is required').trim().escape()
];

export const validateCreateTrip = [
  body('userId').isUUID().withMessage('Invalid User ID'),
  body('busId').isUUID().withMessage('Invalid Bus ID'),
  body('routeId').isUUID().withMessage('Invalid Route ID'),
  body('startStopId').isUUID().withMessage('Invalid Start Stop ID'),
  body('endStopId').isUUID().withMessage('Invalid End Stop ID'),
  body('fare').isFloat({ min: 0 }).withMessage('Fare cannot be negative')
];

export const validateCreateRoute = [
  body('name').notEmpty().withMessage('Route name is required').trim().escape(),
  body('startPoint').notEmpty().withMessage('Start point is required').trim().escape(),
  body('endPoint').notEmpty().withMessage('End point is required').trim().escape(),
  body('distance').isFloat({ min: 0 }).withMessage('Distance must be a positive number'),
  body('estimatedDuration').isInt({ min: 1 }).withMessage('Estimated duration must be positive')
];

export const validateCreateStop = [
  body('name').notEmpty().withMessage('Stop name is required').trim().escape(),
  body('routeId').isUUID().withMessage('Invalid Route ID'),
  body('latitude').isFloat({ min: -90, max: 90 }).withMessage('Invalid latitude'),
  body('longitude').isFloat({ min: -180, max: 180 }).withMessage('Invalid longitude'),
  body('sequenceNumber').isInt({ min: 1 }).withMessage('Sequence number must be at least 1')
];

export const validatePagination = [
  query('page').optional().isInt({ min: 1 }).withMessage('Page parameter must be a positive integer').toInt(),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100').toInt()
];

export const validateUUID = (paramName: string = 'id') => [
  param(paramName).isUUID().withMessage(`Invalid ${paramName} format`)
];

export const validateLinkTelebirr = [
  body('phone')
    .notEmpty().withMessage('Phone number is required')
    .isString().trim()
    .matches(/^(09\d{8}|2519\d{8}|9\d{8})$/, 'Phone must be Ethiopian format (09xxxxxxxx, 2519xxxxxxxx, or 9xxxxxxx)')
];

export const validateTopup = [
  body('amount')
    .isFloat({ gt: 0 }).withMessage('Amount must be greater than 0')
    .isNumeric().withMessage('Amount must be a number')
];

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.type === 'field' ? err.path : '',
        message: err.msg
      }))
    });
    return;
  }
  next();
};
