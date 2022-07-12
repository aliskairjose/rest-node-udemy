import { Router } from "express";
import { check } from "express-validator";
import { UserController } from "../controllers/user.controller.js";
import { validateField } from "../middlewares/validate-field.js";
import { emailExist, validateRole, validateUserId } from "../helpers/db-validators.js";
import { validateJWT } from "../middlewares/validate-jwt.js";
export class User {
  constructor() {
    this.router = Router()
    this.userCtrl = new UserController

    this.router.get('/', this.userCtrl.get)

    this.router.get('/:id', [
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(validateUserId),
      validateField
    ], this.userCtrl.getbyId)

    this.router.put('/:id', [
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(validateUserId),
      check('role').custom(validateRole),
      validateField
    ], this.userCtrl.update)

    this.router.post('/', [
      check('name', 'El nombre es obligatorio').notEmpty(),
      check('email', 'El email es inválido').isEmail(),
      check('email', 'El email es obligatorio').notEmpty(),
      check('email').custom(emailExist),
      check('password', 'El password es obligatorio').notEmpty(),
      check('password', 'El password es debe tener al menos 6 caracteres').isLength({ min: 6 }),
      check('role').custom(validateRole),
      // check('role', 'El role no es permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
      validateField
    ], this.userCtrl.post)

    this.router.delete('/:id', [
      validateJWT,
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(validateUserId),
      validateField
    ], this.userCtrl.delete)

    this.router.patch('/', this.userCtrl.patch)
  }


}