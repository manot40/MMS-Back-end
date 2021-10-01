import bcrypt from "bcrypt";
import { Document, Schema, model } from "mongoose";

export interface UserDocument extends Document {
  username: string;
  password: string;
  role: string;
  name: string;
  affiliation: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    name: { type: String, required: true },
    affiliation: { type: String, required: true },
    avatar: { type: String, default: "default.jpg" },
  },
  { timestamps: true }
);

// Password Salting
UserSchema.pre("save", async function (next) {
  let user = this as UserDocument;

  if (!user.isModified("password")) return next();

  // Salt and Hash
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hashSync(user.password, salt);

  // Plaintext to Hashed Password
  user.password = hash;

  return next();
});

// Login Procedure and Validating Password
UserSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  const user = this as UserDocument;

  return bcrypt.compare(candidatePassword, user.password).catch(() => false);
};

const User = model<UserDocument>("User", UserSchema);

export default User;
