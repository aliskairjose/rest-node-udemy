import { Router } from "express";
import { check } from "express-validator";
import { UploadController } from "../controllers/uploads.controller.js";
import { allowedCollections } from "../helpers/db-validators.js";
import { validateField } from "../middlewares/validate-field.js";

export class UploadRoute {
  constructor() {
    this.router = new Router()
    this.uploadCtrl = new UploadController

    /**
     * /api/uploads
     */
    this.router.post('/', this.uploadCtrl.uploadFile)

    this.router.put('/:collection/:id', [
      check('id', 'Debe ser un id valido mongodb').isMongoId(),
      check('collection').custom(c => allowedCollections(c, ['users', 'products'])),
      validateField
    ], this.uploadCtrl.updateImage)

  }
}