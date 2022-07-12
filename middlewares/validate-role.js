import { response, request } from "express"

export const isAdmin = async (req = request, res = response) => {

  if (!req.user) {
    return res.status(500).json({
      msg: 'Se requiere verificar el role sin validar token primero'
    })
  }

  const { role, name } = req.user
  if (role != 'ADMIN_ROLE') {
    return res.status(401).json({
      msg: 'El usuario no tiene role adminstrador'
    })
  }

  next();
}

export const hasRole = (...roles) => {

  return (req = request, res = response, next) => {
    if (!req.user) {
      return res.status(500).json({
        msg: 'Se requiere verificar el role sin validar token primero'
      })
    }

    if (!roles.includes(req.user.rol)) {
      return res.status(401).json({
        msg: `El usuario no posee ningun role permitido ${roles}`
      })
    }
    next()
  }
}