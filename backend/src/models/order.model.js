import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: String,
    priceAtPurchase: Number,
    images: {
      type: [String],
      default: [],

    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
    subtotal: Number,
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    items: [orderItemSchema],

    totalAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: ['pending', 'confirmed', 'shipped', 'delivered'],
      default: 'pending',
    },

    statusHistory: [
      {
        status: String,
        updatedAt: {
          type: Date,
          default: Date.now,
        },
        _id: false
      },

    ],
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });
orderSchema.index({ status: 1 });

orderSchema.set('toJSON', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
  }
});

orderSchema.set('toObject', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
  }
});

export default mongoose.model('Order', orderSchema);