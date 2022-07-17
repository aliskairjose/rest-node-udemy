import { Router } from "express";
import { check } from "express-validator";
import { existCategory } from "../helpers/db-validators.js";
import { CategoryController } from "../controllers/category.controller.js";
import { validateJwt, validateFields } from '../middlewares/index.js'
import { isAdmin } from "../middlewares/validate-role.js";

export class CategoryRoute {
  constructor() {
    this.router = Router()
    this.catCtrl = new CategoryController

    /**
     * /api/categories
     */

    // Listado de categorias
    this.router.get('/', this.catCtrl.list)

    // Obtener categria por id
    this.router.get('/:id',
      [
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existCategory),
        validateFields
      ],
      this.catCtrl.getById)

    // Crear categoria: privado - validar token
    this.router.post('/', [
      validateJwt,
      check('name', 'El nombre de la categoria es obligatorio').notEmpty(),
      validateFields
    ], this.catCtrl.add)

    // Actulizar la categoria: privado -  validar token
    this.router.put('/:id',
      [
        validateJwt,
        check('id', 'No es un id valido').isMongoId(),
        check('id').custom(existCategory),
        check('name', 'El nombre de la categoria es obligatorio').notEmpty(),
        validateFields
      ], this.catCtrl.update)

    // Borrar categoria - Solo admin - soft delete - token valido
    this.router.delete('/:id', [
      validateJwt,
      isAdmin,
      check('id', 'No es un id valido').isMongoId(),
      check('id').custom(existCategory),
      validateFields
    ], this.catCtrl.delete)
  }
}