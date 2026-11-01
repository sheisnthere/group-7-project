import mongoose, { Document, Schema, Model, Types } from 'mongoose';

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  stock: number;
  createdBy?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Nama produk wajib diisi'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Harga produk wajib diisi'],
      min: [0, 'Harga tidak boleh negatif'],
    },
    image: {
      type: String,
      default: 'https://via.placeholder.com/300',
      trim: true,
    },
    category: {
      type: String,
      default: 'Umum',
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: [0, 'Stok tidak boleh negatif'],
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> = mongoose.model<IProduct>('Product', productSchema);
export default Product;
