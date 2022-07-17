import { Router } from "express";
import { check } from "express-validator";
import { UserController } from "../controllers/user.controller.js";
import { existEmail, validateRole, validateUserId } from "../helpers/db-validators.js";
import {
  validateFields,
  validateJwt,
  validateRoles
} from '../middlewares/index.js'
export class User {
  constructor() {
    this.router = Router()
    this.userCtrl = new UserController

    this.router.get('/', this.userCtrl.get)

    this.router.get('/:id', [
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(validateUserId),
      validateFields
    ], this.userCtrl.getbyId)

    this.router.put('/:id', [
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(validateUserId),
      check('role').custom(validateRole),
      validateFields
    ], this.userCtrl.update)

    this.router.post('/', [
      check('name', 'El nombre es obligatorio').notEmpty(),
      check('email', 'El email es inválido').isEmail(),
      check('email', 'El email es obligatorio').notEmpty(),
      check('email').custom(existEmail),
      check('password', 'El password es obligatorio').notEmpty(),
      check('password', 'El password es debe tener al menos 6 caracteres').isLength({ min: 6 }),
      check('role').custom(validateRole),
      // check('role', 'El role no es permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
      validateFields
    ], this.userCtrl.post)

    this.router.delete('/:id', [
      validateJwt,
      // isAdmin,
      validateRoles.hasRole('ADMIN_ROLE', 'SALE_ROLE'),
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(validateUserId),
      validateFields
    ], this.userCtrl.delete)

    this.router.patch('/', this.userCtrl.patch)
  }


}