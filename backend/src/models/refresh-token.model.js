import mongoose from 'mongoose';
 
const { Schema, model } = mongoose;


const refreshTokenSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    tokenHash: {
      type: String,
      required: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },

  },
  {
    timestamps: true,
  }
);

refreshTokenSchema.index({ tokenHash: 1 });
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });



refreshTokenSchema.set('toJSON', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
  }
});

refreshTokenSchema.set('toObject', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.__v;
  }
});
export default model('RefreshToken', refreshTokenSchema);
