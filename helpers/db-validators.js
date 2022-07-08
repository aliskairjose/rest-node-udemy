import Role from '../models/role.js'
import User from '../models/user.js'

export const validateRole = async (role = '') => {
  const exist = await Role.findOne({ role })

  if (!exist) {
    throw new Error(`El role ${role} no esta registrado en la DB`)
  }
}

export const emailExist = async (email = '') => {
  // Verificar si email ya existe
  const exist = await User.findOne({ email })

  if (exist) {
    throw new Error(`El email ${email} ya eta registrado en la DB`)
  }
}

export const validateUserId = async (id = '') => {
  // Validamos que el id exista en un usuario
  const exist = await User.findById(id)
  if (!exist) {
    throw new Error('El id no existe en la db')
  }
} 