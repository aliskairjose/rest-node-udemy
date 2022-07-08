import { Router } from "express";
import { check } from "express-validator";
import { UserController } from "../controllers/user.controller.js";
import { validateField } from "../middlewares/validate-field.js";
import Role from '../models/role.js'

export class User {
  constructor() {
    this.router = Router()
    this.user = new UserController

    this.router.get('/', this.user.get)

    this.router.get('/list', this.user.list)

    this.router.put('/:id', this.user.put)

    this.router.post('/', [
      check('name', 'El nombre es obligatorio').notEmpty(),
      check('email', 'El email es inválido').isEmail(),
      check('email', 'El email es obligatorio').notEmpty(),
      check('password', 'El password es obligatorio').notEmpty(),
      check('password', 'El password es debe tener al menos 6 caracteres').isLength({ min: 6 }),
      check('role').custom(async (role = '') => {
        const exist = await Role.findOne({ role })

        if (!exist) {
          throw new Error(`El role ${role} no esta registrado en la DB`)
        }
      }),
      // check('role', 'El role no es permitido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
      validateField
    ], this.user.post)

    this.router.delete('/:id', this.user.delete)

    this.router.patch('/', this.user.patch)
  }


}