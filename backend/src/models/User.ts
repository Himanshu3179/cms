import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "writer" | "viewer";
  createdAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin", "writer", "viewer"],
    default: "viewer",
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (
  candidatePassword: string
) {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
