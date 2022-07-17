import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const CategorySchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nombre obligatorio'],
      unique: true
    },
    state: {
      type: Boolean,
      default: true,
      required: true
    },
    // Referencia al modelo user
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }
  }
)

/**
 * ? Sobreescribimos el metodo toJSON y eliminamos __v y password de la respuesta desestructurando el objeto
 * ? y retornando el resto de las propiedades, con el this.toObject, y para esto debemos usar function y no una funcion de flecha
 */
CategorySchema.method('toJSON', function () {
  const { __v, ...rest } = this.toObject()
  return rest
})


const CategoryModel = model('Category', CategorySchema)

export default CategoryModel