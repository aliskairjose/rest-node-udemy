import jwt from 'jsonwebtoken'
import { response, request } from "express"
import User from '../models/user.js'

export const validateJWT = async (req = request, res = response, next) => {
  const token = req.header('x-token')

  if (!token) {
    return res.status(401).json({
      msg: 'Token requerido'
    })
  }

  try {
    const { uid } = jwt.verify(token, process.env.SECRETORPUBLICKEY)

    // leer el usuario que corresponda al uid
    const user = await User.findById(uid)

    if (!user) {
      return res.status(401).json({
        msg: 'Usuario no existe en DB'
      })
    }

    // validar si el state es false
    if (!user.state) {
      return res.status(401).json({
        msg: 'Token no valido - state false'
      })
    }
    req.user = user

    next()
  } catch (error) {
    console.log(error)
    res.status(401).json({
      msg: 'Token no valido'
    })
  }

}