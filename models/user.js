
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
      enum: ['ADMIN_ROLE', 'USER_ROLE']
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

const User = model('User', UserSchema)

export default User