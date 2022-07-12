import { response, request } from "express"
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
export class UserController {
  constructor() { }

  get = async (req = request, res = response) => {

    const { from = 0, limit = 5 } = req.query

    const [users, total] = await Promise.all([
      User.find({ state: true }).skip(from).limit(limit),
      User.countDocuments({ state: true })
    ])

    res.json({
      msg: 'get API - Controllersss',
      body: users,
      total
    })
  }

  getbyId = async (req = request, res = response) => {
    const { id } = req.params
    const user = await User.findOne({ _id: id })
    res.json({
      body: user,
      msg: 'getById API - Controller'
    })
  }

  post = async (req = request, res = response) => {

    const { name, password, role, email } = req.body
    const user = new User({ name, email, password, role })

    // Encriptar password
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    await user.save()

    res.json({
      msg: 'post API - Controller',
      body: user
    })
  }

  update = async (req = request, res = response) => {
    // Id esta definido en la ruta  this.router.put('/:id', this.user.put)
    const { id } = req.params

    const { _id, password, google, email, ...rest } = req.body

    if (password) {
      // Encriptar password
      const salt = bcrypt.genSaltSync()
      rest.password = bcrypt.hashSync(password, salt)
    }

    const user = await User.findByIdAndUpdate(id, rest)

    res.json({
      body: user,
      msg: 'put API - Controller'
    })
  }

  patch = (req = request, res = response) => {
    res.json({
      msg: 'patch API - Controller'
    })
  }

  delete = async (req, res = response) => {
    // Id esta definido en la ruta  this.router.put('/:id', this.user.put)
    const { id } = req.params

    // Borrado logico, mas recomendado, returnOriginal false para que devuelva el objeto actualizado, 
    // si no trae el anterior a la actualizacion
    const user = await User.findByIdAndUpdate(id, { state: false }, { returnOriginal: false })
    const authUser = req.user


    res.json({
      body: { uid, user },
      msg: 'delete API - Controller'
    })
  }


}