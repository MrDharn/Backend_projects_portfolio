const {body} = require("express-validator");

const contactValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 }),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Provide a valid email")
    .normalizeEmail(),
  body("subject").notEmpty().withMessage("subject is required"),
  body("message")
    .isLength({ min: 10, max: 3000 })
    .withMessage("Message must be between 10 and 3000 characters"),
];

module.exports = contactValidation