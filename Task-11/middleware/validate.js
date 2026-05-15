const { body, param, validationResult } = require('express-validator');

const handleErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const messages = errors.array().map((e) => e.msg);
    return res.status(400).json({ success: false, message: messages.join(', ') });
  }
  next();
};

const createRecipeRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Recipe name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Recipe name must be 2-100 characters'),

  body('ingredients')
    .isArray({ min: 1 }).withMessage('At least one ingredient is required')
    .custom((arr) => arr.every((i) => typeof i === 'string' && i.trim().length > 0))
    .withMessage('Each ingredient must be a non-empty string'),

  body('instructions')
    .trim()
    .notEmpty().withMessage('Instructions are required')
    .isLength({ min: 10 }).withMessage('Instructions must be at least 10 characters'),

  body('cuisine')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Cuisine must be at most 50 characters'),

  body('prepTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Prep time must be a non-negative integer'),

  body('cookTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Cook time must be a non-negative integer'),

  body('servings')
    .optional()
    .isInt({ min: 1 }).withMessage('Servings must be at least 1'),
];

const updateRecipeRules = [
  param('id')
    .isMongoId().withMessage('Invalid recipe ID format'),

  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Recipe name must be 2-100 characters'),

  body('ingredients')
    .optional()
    .isArray({ min: 1 }).withMessage('At least one ingredient is required')
    .custom((arr) => arr.every((i) => typeof i === 'string' && i.trim().length > 0))
    .withMessage('Each ingredient must be a non-empty string'),

  body('instructions')
    .optional()
    .trim()
    .isLength({ min: 10 }).withMessage('Instructions must be at least 10 characters'),

  body('cuisine')
    .optional()
    .trim()
    .isLength({ max: 50 }).withMessage('Cuisine must be at most 50 characters'),

  body('prepTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Prep time must be a non-negative integer'),

  body('cookTime')
    .optional()
    .isInt({ min: 0 }).withMessage('Cook time must be a non-negative integer'),

  body('servings')
    .optional()
    .isInt({ min: 1 }).withMessage('Servings must be at least 1'),
];

const idRule = [
  param('id')
    .isMongoId().withMessage('Invalid recipe ID format'),
];

module.exports = {
  handleErrors,
  createRecipeRules,
  updateRecipeRules,
  idRule,
};
