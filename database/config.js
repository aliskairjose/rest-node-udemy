import mongoose from "mongoose"

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB)
    console.log('Database online')
  } catch (error) {
    console.error(error)
    throw new Error('Error en conexión de db', error)
  }
}
