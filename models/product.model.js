import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const ProductSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Nombre obligatorio']
    },
    price: {
      type: Number,
      default: 0
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    description: {
      type: String
    },
    available: {
      type: Boolean,
      default: true
    },
    img: {
      type: String
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
ProductSchema.method('toJSON', function () {
  const { __v, ...rest } = this.toObject()
  return rest
})
const ProductModel = model('Product', ProductSchema)

export default ProductModel