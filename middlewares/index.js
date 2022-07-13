e import { validateField } from "../middlewares/validate-field.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
import { hasRole, isAdmin } from "../middlewares/validate-role.js";

export const validateRoles = { hasRole, isAdmin }
export const validateJwt = validateJWT
export const validateFields = validateField