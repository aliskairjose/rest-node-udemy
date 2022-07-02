import { Router } from "express";
import { UserController } from "../controllers/user.controller.js";

export class User {
  constructor() {
    this.router = Router()
    this.user = new UserController

    this.router.get('/', this.user.get)
    this.router.get('/list', this.user.list)
    this.router.put('/:id', this.user.put)
    this.router.post('/', this.user.post)
    this.router.delete('/:id', this.user.delete)
    this.router.patch('/', this.user.patch)
  }


}