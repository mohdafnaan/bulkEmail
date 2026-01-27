import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    emailVerify: {
      type: Boolean,
      default: false,
    },
    emailOtp: {
      type: String,
      default: null,
    },
    resume: {
      fileName: String,
      filePath: String,
      fileType: String,
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
    resumeSent: {
      type: Boolean,
      default: false,
    },
    resumeSentAt : {
        type : Date
    }
  },
  {
    timestamps: true,
  },
);

const userModel = mongoose.model("users", userSchema);

export default userModel;
