import { response, request } from "express"
import CategoryModel from '../models/category.model.js'

export class CategoryController {
  constructor() { }

  // Listado de categorias - paginado - total - objeto populate
  list = async (req = request, res = response) => {

    const { from = 0, limit = 5 } = req.query

    const [categories, total] = await Promise.all([
      CategoryModel
        .find({ state: true })
        .skip(from).limit(limit)
        .populate('user', ['name', 'email']), // populate obtiene la relacion del usuario en categoria, la segunda propiedad es el campo a mostrar, array si son mas de uno
      CategoryModel.countDocuments({ state: true })
    ])

    res.json({
      msg: 'Litado de categorias',
      body: categories,
      total
    })

  }

  // Obtener categria por id - objeto populate
  getById = async (req = request, res = response) => {

    const { id } = req.params
    try {
      const category = await CategoryModel.findById(id).populate('user'['name', 'email'])
      res.json({
        body: category,
        msg: 'Categoria encontrada'
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Ha ocurrido un error, contacte con el administrador'
      })
    }
  }

  add = async (req = request, res = response) => {
    const name = req.body.name.toUpperCase()
    const exist = await CategoryModel.findOne({ name })

    if (exist) {
      return res.status(400).json({
        msg: `La categoria ${name} ya existe en DB`
      })
    }

    // Generar la data a guardar
    const data = { name, user: req.user._id }

    const category = await new CategoryModel(data)
    await category.save()

    res.status(201).json({
      msg: `Se ha creado una nueva categoria: ${name}`
    })
  }

  update = async (req = request, res = response) => {
    const { id } = req.params
    const { state, user, ...data } = req.body

    try {

      data.name = data.name.toUpperCase()
      data.user = req.user._id

      const category = await CategoryModel.findByIdAndUpdate(id, data, { returnOriginal: false }).populate('user', ['name', 'email'])

      res.status(200).json({
        msg: 'Categoria actualizada',
        body: category
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Ha ocurrido un error, contacte con el administrador'
      })
    }
  }

  delete = async (req = request, res = response) => {
    const { id } = req.params

    try {
      const data = { state: false, user: req.user._id }
      const category = await CategoryModel.findByIdAndUpdate(id, data, { returnOriginal: false }).populate('user', ['name', 'email'])

      res.status(200).json({
        msg: 'Categoria eliminada',
        body: category
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Ha ocurrido un error, contacte con el administrador'
      })
    }
  }
}