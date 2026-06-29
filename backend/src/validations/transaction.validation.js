const { body } = require("express-validator");

const depositValidation = [
    body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),

    body("idempotencyKey")
        .notEmpty()
        .withMessage("Idempotency key is required")
];

const withdrawValidation = [
    body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),

    body("idempotencyKey")
        .notEmpty()
        .withMessage("Idempotency key is required")
];

const transferValidation = [
    body("toEmail")
        .isEmail()
        .withMessage("Valid receiver email is required"),

    body("amount")
        .isFloat({ gt: 0 })
        .withMessage("Amount must be greater than 0"),

    body("idempotencyKey")
        .notEmpty()
        .withMessage("Idempotency key is required")
];

module.exports = { depositValidation, withdrawValidation, transferValidation };