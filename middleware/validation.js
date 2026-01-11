const Joi = require("joi");

// Validation middleware factory
const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return res.status(400).json({ error: errors.join(", ") });
    }

    // Replace req.body with validated and sanitized value
    req.body = value;
    next();
  };
};

// Signup validation schema
const signupSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Name is required",
    "any.required": "Name is required",
  }),
  email: Joi.string().email().required().lowercase().trim().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().min(6).required().messages({
    "string.min": "Password must be at least 6 characters",
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
  preferences: Joi.array().items(Joi.string()).default([]).optional(),
});

// Login validation schema
const loginSchema = Joi.object({
  email: Joi.string().email().required().lowercase().trim().messages({
    "string.email": "Invalid email format",
    "string.empty": "Email is required",
    "any.required": "Email is required",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password is required",
    "any.required": "Password is required",
  }),
});

// Preferences validation schema
const preferencesSchema = Joi.object({
  preferences: Joi.array().items(Joi.string()).required().messages({
    "array.base": "Preferences must be an array",
    "any.required": "Preferences are required",
  }),
});

module.exports = {
  validate,
  signupSchema,
  loginSchema,
  preferencesSchema,
};
