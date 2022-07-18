import Role from '../models/role.js'
import User from '../models/user.js'
import CategoryModel from '../models/category.model.js'
import ProductModel from '../models/product.model.js'

export const validateRole = async (role = '') => {
  const exist = await Role.findOne({ role })

  if (!exist) {
    throw new Error(`El role ${role} no esta registrado en la DB`)
  }
}

export const existEmail = async (email = '') => {
  // Verificar si email ya existe
  const exist = await User.findOne({ email })

  if (exist) {
    throw new Error(`El email ${email} ya esta registrado en la DB`)
  }
}

export const validateUserId = async (id = '') => {
  // Validamos que el id exista en un usuario
  const exist = await User.findById(id)
  if (!exist) {
    throw new Error('El id no existe en la db')
  }
}

export const existCategory = async (id = '') => {
  console.log('category validare')
  // Validamos que el id exista en la categoria
  const exist = await CategoryModel.findById(id)
  if (!exist) {
    throw new Error('El id de la categoria no existe en la db')
  }
}
export const existProduct = async (id = '') => {
  // Validamos que el id exista en la categoria
  const exist = await ProductModel.findById(id)
  if (!exist) {
    throw new Error('El id del producto no existe en la db')
  }
}