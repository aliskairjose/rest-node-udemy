
import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
    },
    email: {
      type: String,
      required: [true, 'El correo es obligatorio'],
      unique: true
    },
    password: {
      type: String,
      required: [true, 'El password es obligatorio']
    },
    img: {
      type: String,
    },
    role: {
      type: String,
      required: true,
      default: 'USER_ROLE',
      enum: ['ADMIN_ROLE', 'USER_ROLE', 'SALE_ROLE']
    },
    state: {
      type: Boolean,
      default: true
    },
    google: {
      type: Boolean,
      default: false
    }
  }
)

/**
 * ? Sobreescribimos el metodo toJSON y eliminamos __v y password de la respuesta desestructurando el objeto
 * ? y retornando el resto de las propiedades, con el this.toObject, y para esto debemos usar function y no una funcion de flecha
 */
UserSchema.method('toJSON', function () {
  const { __v, password, _id, ...rest } = this.toObject()
  rest.uid = _id
  return rest
})

const User = model('User', UserSchema)

export default User