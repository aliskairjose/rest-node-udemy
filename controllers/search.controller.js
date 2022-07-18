import { response, request } from "express"
import mongoose from "mongoose"
import User from '../models/user.js'
import CategoryModel from '../models/category.model.js'
import ProductModel from '../models/product.model.js'
const { ObjectId } = mongoose.Types

const allowedCollections = [
  'users',
  'categories',
  'products',
  'roles'
]

export class SearchController {
  constructor() { }

  search = async (req = request, res = response) => {

    const { collection, termino } = req.params

    if (!allowedCollections.includes(collection)) {
      return res.status(400).json({
        msg: `Las colecciónes permitidas son ${allowedCollections}`
      })
    }

    switch (collection) {
      case 'users':
        this.searchByUser(termino, res)
        break;
      case 'categories':
        this.searchByCategory(termino, res)
        break;
      case 'products':
        this.searchByProduct(termino, res)
        break;
      default:
        res.status(500).json({
          msg: 'Busqueda pendiente por desarrollar'
        })
        break;
    }
  }

  async searchByUser (termino = '', res = response) {
    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
      const user = await User.findById(termino)
      res.json({
        body: user ? [user] : []
      })
    }

    const regex = new RegExp(termino, 'i')
    const users = await User.find({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }]
    })
    const total = await User.countDocuments({
      $or: [{ name: regex }, { email: regex }],
      $and: [{ state: true }]
    })
    res.json({
      msg: 'Listado de usuarios',
      body: users,
      total
    })
  }

  async searchByCategory (termino = '', res = response) {
    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
      const category = await CategoryModel
        .findById(termino)
        .populate('user', ['name', 'email'])

      res.json({
        body: category ? [category] : []
      })
    }

    const regex = new RegExp(termino, 'i')
    const categories = await CategoryModel
      .find({ name: regex, state: true })
      .populate('user', ['name', 'email'])
    const total = await CategoryModel.countDocuments({ name: regex, state: true })

    res.json({
      msg: 'Listado de categorias',
      body: categories,
      total
    })
  }

  async searchByProduct (termino = '', res = response) {
    const isMongoID = ObjectId.isValid(termino)

    if (isMongoID) {
      const product = await ProductModel
        .findById(termino)
        .populate('user', ['name', 'email'])
        .populate('category', 'name')

      res.json({
        body: product ? [product] : []
      })
    }

    const regex = new RegExp(termino, 'i')
    const products = await ProductModel
      .find({ name: regex, state: true })
      .populate('user', ['name', 'email'])
      .populate('category', 'name')
    const total = await ProductModel.countDocuments({ name: regex, state: true })

    res.json({
      msg: 'Listado de productos',
      body: products,
      total
    })
  }


}