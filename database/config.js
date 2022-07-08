import mongoose from "mongoose"
if (process.env.NODE_ENV === 'production') dotenv.config();

export const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB)
    console.log('Database online')
  } catch (error) {
    console.error(error)
    throw new Error('Error en conexión de db', error)
  }
}
