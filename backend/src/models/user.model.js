import mongoose from "mongoose";

const { Schema, model } = mongoose;


const userSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      maxlength: 255,
    },

    passwordHash: {
      type: String,
      required: true,
      select: false,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },


  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1 }, { unique: true });

 

userSchema.set('toJSON', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.passwordHash;
    delete ret.__v;
  }
});

userSchema.set('toObject', {
  transform: function (_, ret) {
    ret.id = ret._id
    delete ret._id;
    delete ret.passwordHash;
    delete ret.__v;
  }
});

export default model("User", userSchema);