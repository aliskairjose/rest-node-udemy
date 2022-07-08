import Role from '../models/role.js'

export const validateRole = async (role = '') => {
  const exist = await Role.findOne({ role })

  if (!exist) {
    throw new Error(`El role ${role} no esta registrado en la DB`)
  }
}