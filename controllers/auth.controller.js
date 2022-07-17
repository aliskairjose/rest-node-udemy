import { response, request } from "express"
import User from '../models/user.js'
import bcrypt from 'bcryptjs'
import { generateJWT } from "../helpers/jwt.js"
import { googleVerify } from "../helpers/google-verify.js"

export class AuthController {
  constructor() { }

  login = async (req = request, res = response) => {

    const { email, password } = req.body

    try {
      // Veirficar si el email existe
      const user = await User.findOne({ email })

      if (!user) {
        return res.status(400).json({
          msg: 'Credenciales no válidas'
        })
      }

      // Verificar si el usuario esta activo
      if (!user.state) {
        return res.status(400).json({
          msg: 'Usuario no activo'
        })
      }

      // Verificar password
      const validPass = bcrypt.compareSync(password, user.password)
      if (!validPass) {
        return res.status(400).json({
          msg: 'Credenciales no válidas - password'
        })
      }

      // Generar JWT
      const token = await generateJWT(user.id)

      res.status(200).json({
        msg: 'Login - AuthController',
        body: user,
        token
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        msg: 'Ha ocurrido un error, contacte con el administrador'
      })
    }


  }

  googleSignIn = async (req = request, res = response) => {
    const { id_token } = req.body
    try {
      const { email, name, img } = await googleVerify(id_token);
      let user = await User.findOne({ email })

      if (!user) {
        // Crear usuario
        const data = {
          name,
          email,
          password: 'password',
          img,
          google: true,
          role: 'USER_ROLE'
        }
        user = new User(data)
        await user.save()
      }

      // Si el usuario en db esta eliminado ed db (soft delete)
      if (!user.state) {
        return res.status(401).json({
          msg: 'Usuario bloqueado, contacte con el administrador'
        })
      }

      // Generar el JWT
      const token = await generateJWT(user.id)

      res.json({
        msg: 'Google SignIn correcto',
        body: user,
        token
      })
    } catch (error) {
      console.log(error)
      res.status(400).json({
        msg: 'El token no se pudo verificar'
      })
    }
  }

  register = async (req = request, res = response) => {
    // Se puede omitir el return cuando es el ultimo en ejecutarse el res.json
    res.status(200).json({
      msg: 'Register - AuthController'
    })
  }

}