// import { body, param, query, validationResult } from 'express-validator';

// export const validateRegister = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').isLength({ min: 6 }).trim().escape(),
//   body('fullName').notEmpty().trim().escape(),
//   body('phone').optional().isMobilePhone('any')
// ];

// export const validateLogin = [
//   body('email').isEmail().normalizeEmail(),
//   body('password').notEmpty().escape()
// ];

// export const validateCreateTransaction = [
//   body('userId').isUUID(),
//   body('type').isIn(['debit', 'credit']),
//   body('amount').isFloat({ min: 0.01 }),
//   body('description').notEmpty().trim().escape()
// ];

// export const validateCreateTrip = [
//   body('userId').isUUID(),
//   body('busId').isUUID(),
//   body('routeId').isUUID(),
//   body('startStopId').isUUID(),
//   body('endStopId').isUUID(),
//   body('fare').isFloat({ min: 0 })
// ];

// export const validateCreateRoute = [
//   body('name').notEmpty().trim().escape(),
//   body('startPoint').notEmpty().trim().escape(),
//   body('endPoint').notEmpty().trim().escape(),
//   body('distance').isFloat({ min: 0 }),
//   body('estimatedDuration').isInt({ min: 1 })
// ];

// export const validateCreateStop = [
//   body('name').notEmpty().trim().escape(),
//   body('routeId').isUUID(),
//   body('latitude').isFloat({ min: -90, max: 90 }),
//   body('longitude').isFloat({ min: -180, max: 180 }),
//   body('sequenceNumber').isInt({ min: 1 })
// ];

// export const validatePagination = [
//   query('page').optional().isInt({ min: 1 }).toInt(),
//   query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
// ];

// export const validateUUID = (paramName: string = 'id') => [
//   param(paramName).isUUID()
// ];

// export const handleValidationErrors = (req: any, res: any, next: any) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       errors: errors.array()
//     });
//   }
//   next();
// };
