// Validations Helpers
const {
    check
} = require('express-validator');

exports.validRegister = [
    check('name', 'Name is required').not().isEmpty()
    .isLength({
        min: 4,
        max: 32
    }).withMessage('name must be between 3 to 32 characters'),
    check('email').not().isEmpty().withMessage('Must be a valid email address'),
    check('password', 'password is required').not().isEmpty(),
    check('password').isLength({
        min: 6
    }).withMessage('Password must contain at leat 6 characters').matches(/\d/).withMessage('password must contain a number')
]

exports.validLogin = [
    check('email').isEmail()
    .withMessage('Must be a valid email address'),
    check('email').not().isEmpty().withMessage('Must be a valid email address'),
    check('password', 'password is required').not().isEmpty(),
    check('password').isLength({
        min: 6
    }).withMessage('Password must contain at leat 6 characters').matches(/\d/).withMessage('password must contain a number')
]

// Forgot password
exports.forgotPasswordValidator = [
    check('email').not().isEmpty().isEmail()
    .withMessage('Must be a valid email address')
]

// Reset password
exports.resetPasswordValidator = [
    check('newPassword')
        .not()
        .isEmpty()
        .isLength({ min: 6 })
        .withMessage('Password must be at least  6 characters long')
]

exports.mimeTypeValidator = (mimetype) => {
    if (
        mimetype === "image/jpeg" ||
        mimetype === "image/png" ||
        mimetype === "application/pdf"
      ) {
        return true;
      } else {
        return false;
      }
}