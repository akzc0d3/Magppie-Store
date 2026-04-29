import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        description: {
            type: String,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        category: {
            type: String,
            required: true,
        },
        stock: {
            type: Number,
            required: true,
            min: 0,
        },
        images: [
            {
                type: String,
            },
        ],
     
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    { timestamps: true }
);


productSchema.index(
  { name: 'text', description: 'text' },
  {
    weights: {
      name: 5,
      description: 2,
    },
  }
);
productSchema.index({ category: 1, price: 1, isActive: 1 });
productSchema.index({ createdAt: 1 });


productSchema.set('toJSON', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
  }
});

productSchema.set('toObject', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
  }
});
export default mongoose.model('Product', productSchema);