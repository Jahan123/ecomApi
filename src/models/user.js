import { Schema, model } from "mongoose";
import findOrCreate from "mongoose-findorcreate";
import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
const UserSchema = new Schema(
  {
    loginType: {
      type: String,
      enum: ["normal", "social-login", "otp-login"],
      default: "normal",
    },
    otpDetails: {
      phone: {
        type: String,
      },
    },
    socialLoginInfo: {
      loginType: {
        type: String,
        required: false,
      },
      loginUserDetails: {
        type: Object,
        required: false,
      },
    },
    avatar: {
      type: String,
      required: false,
    },
    username: {
      type: String,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "Admin"],
      default: "user",
    },
    email: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: false,
    },
    verificationCode: {
      type: String,
      required: false,
    },
    resetPasswordToken: {
      type: String,
      required: false,
    },
    resetPasswordExpiresIn: {
      type: Date,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
UserSchema.plugin(findOrCreate);
UserSchema.pre("save", async function (next) {
  const { password } = this;
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await hash(password, 10);
  next();
});
UserSchema.statics.comparePassword = async function (bodyPassword, password) {
  return await compare(bodyPassword, password);
};
UserSchema.statics.checkForData = async function (data, datatype) {
  const user = await this.findOne({ [datatype]: data });
  return user;
};
UserSchema.statics.generateToken = async function (
  data,
  TOKEN_SECRET_KEY,
  expiresIn
) {
  const token = await sign(
    {
      ...data,
    },
    TOKEN_SECRET_KEY,
    { expiresIn }
  );
  return token;
};

const User = model("User", UserSchema);
export default User;
