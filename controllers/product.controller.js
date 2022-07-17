import { response, request } from "express"
import Product from "../models/product.model.js"

export class ProductController {
  constructor() { }

  // Listado de categorias - paginado - total - objeto populate
  list = async (req = request, res = response) => {

    const { from = 0, limit = 5 } = req.query

    const [productos, total] = await Promise.all([
      Product
        .find({ state: true })
        .skip(from).limit(limit)
        .populate('user', ['name', 'email'])
        .populate('category', 'name'),// populate obtiene la relacion del usuario en categoria, la segunda propiedad es el campo a mostrar, array si son mas de uno
      Product.countDocuments({ state: true })
    ])

    res.json({
      msg: 'Litado de productos',
      body: productos,
      total
    })

  }

  // Obtener categria por id - objeto populate
  getById = async (req = request, res = response) => {

    const { id } = req.params
    try {
      const product = await Product.findById(id)
        .populate('user'['name', 'email'])
        .populate('category', 'name')

      res.json({
        body: product,
        msg: 'Producto encontrado'
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Ha ocurrido un error, contacte con el administrador'
      })
    }
  }

  add = async (req = request, res = response) => {
    // const name = req.body.name.toUpperCase()
    const { name, state, user, ...rest } = req.body

    const exist = await Product.findOne({ name })

    if (exist) {
      return res.status(400).json({
        msg: `El producto ${name} ya existe en DB`
      })
    }

    // Generar la data a guardar
    const data = {
      ...rest,
      user: req.user._id,
      name: name.toUpperCase()
    }

    const product = await new Product(data)
    await product.save()

    res.status(201).json({
      msg: `Se ha creado un nuevo producto: ${name}`
    })
  }

  update = async (req = request, res = response) => {
    const { id } = req.params
    const { state, user, ...data } = req.body

    try {

      if (data.name) { data.name = data.name.toUpperCase() }
      data.user = req.user.id

      const product = await Product.findByIdAndUpdate(id, data, { returnOriginal: false })
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      res.status(200).json({
        msg: 'Producto actualizado',
        body: product
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
      const product = await Product.findByIdAndUpdate(
        id, {
        state: false,
        user: req.user._id
      },
        { returnOriginal: false }
      )
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      res.status(200).json({
        msg: 'Producto eliminado',
        body: product
      })

    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Ha ocurrido un error, contacte con el administrador'
      })
    }
  }

}