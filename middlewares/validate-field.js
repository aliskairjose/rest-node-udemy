import { validationResult } from "express-validator/src/validation-result.js"
import { response, request } from "express"

export const validateField = (req = request, res = response, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json(errors)
  }

  next()
}