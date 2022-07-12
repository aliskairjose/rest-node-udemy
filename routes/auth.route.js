import { Router } from "express";
import { check } from "express-validator";
import { AuthController } from "../controllers/auth.controller.js";
import { validateField } from "../middlewares/validate-field.js";
import { emailExist, validateRole, validateUserId } from "../helpers/db-validators.js";

export class AuthRoute {
  constructor() {
    this.router = Router()
    this.authCtrl = new AuthController

    this.router.post('/login', [
      check('email', 'El email es inválido').isEmail(),
      check('email', 'El email es obligatorio').notEmpty(),
      check('password', 'El password es obligatorio').notEmpty(),
      validateField
    ], this.authCtrl.login)

    this.router.post('/register', this.authCtrl.register)
  }
}