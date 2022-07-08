import { response, request } from "express"
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
export class UserController {
  constructor() { }

  get = (req = request, res = response) => {
    const { query, params } = req
    res.json({
      body: { query, params },
      msg: 'get API - Controller'
    })
  }

  list = (req = request, res = response) => {
    res.json({
      msg: 'get list API - Controller'
    })
  }

  post = async (req = request, res = response) => {

    const { name, password, role, email } = req.body

    const user = new User({ name, email, password, role })


    // Verificar si email ya existe
    const exist = await User.findOne({ email })

    if (exist) {
      return res.status(400).json({
        msg: 'El correo ya existe'
      })
    }

    // Encriptar password
    const salt = bcrypt.genSaltSync()
    user.password = bcrypt.hashSync(password, salt)

    await user.save()

    res.json({
      msg: 'post API - Controller',
      body: user
    })
  }

  put = (req = request, res = response) => {
    // Id esta definido en la ruta  this.router.put('/:id', this.user.put)
    const { id } = req.params
    res.json({
      body: id,
      msg: 'put API - Controller'
    })
  }

  patch = (req = request, res = response) => {
    res.json({
      msg: 'patch API - Controller'
    })
  }

  delete = (req, res = response) => {
    // Id esta definido en la ruta  this.router.put('/:id', this.user.put)
    const { id } = req.params
    res.json({
      body: id,
      msg: 'delete API - Controller'
    })
  }


}