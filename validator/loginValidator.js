const { body,validationResult } = require('express-validator')
const User = require("../models/users");
const loginValidateRules = () => {
  return [
    body("username").not().isEmpty().withMessage('username must have value'),
    body("username").custom(async (value) => {
      let user = await User.findOne({
        where: {
          username: value,
        }
      });
      if (!user) {
        throw new Error('you are not regestered');
      }
      return true;
    }),
    body("password").not().isEmpty().withMessage("password must have value"),
  ]
}

const loginValidate = (req, res, next) => {
  const errors = validationResult(req)
  if (errors.isEmpty()) {
    return next()
  }
  const extractedErrors = []
  errors.array().map(err => extractedErrors.push({ [err.param]: err.msg }))

  return res.status(422).json({
    errors: extractedErrors,
  })
}

module.exports = {loginValidateRules,loginValidate};