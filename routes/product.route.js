import { Router } from "express";
import { check } from "express-validator";
import { ProductController } from "../controllers/product.controller.js";
import { existCategory, existProduct } from "../helpers/db-validators.js";
import { validateJwt, validateFields } from '../middlewares/index.js'
import { isAdmin } from "../middlewares/validate-role.js";

export class ProductRoute {
  constructor() {
    this.router = Router()
    this.productCtrl = new ProductController

    /**
     * /api/products
     */

    // Listado de productos
    this.router.get('/', this.productCtrl.list)

    // Obtener producto por id
    this.router.get('/:id',
      [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existProduct),
        validateFields
      ],
      this.productCtrl.getById)

    // Crear producto: privado - validar token
    this.router.post('/', [
      validateJwt,
      check('name', 'El nombre del producto es obligatorio').notEmpty(),
      check('category', 'El id de la categoria no es valido').isMongoId,
      check('id').custom(existCategory),
      validateFields
    ], this.productCtrl.add)

    // Actulizar la producto: privado -  validar token
    this.router.put('/:id',
      [
        validateJwt,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existProduct),
        validateFields
      ], this.productCtrl.update)

    // Borrar producto - Solo admin - soft delete - token valido
    this.router.delete('/:id', [
      validateJwt,
      isAdmin,
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(existProduct),
      validateFields
    ], this.productCtrl.delete)
  }
}
