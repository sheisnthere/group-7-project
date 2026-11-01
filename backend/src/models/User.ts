import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  role: "user" | "admin";
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Nama wajib diisi"],
      trim: true,
      minlength: [2, "Nama minimal 2 karakter"],
    },
    email: {
      type: String,
      required: [true, "Email wajib diisi"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Format email tidak valid"],
    },
    password: {
      type: String,
      required: [true, "Password wajib diisi"],
      minlength: [6, "Password minimal 6 karakter"],
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

// Never expose the password hash when converting to JSON
userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    const sanitized = ret as unknown as Record<string, unknown>;
    delete sanitized.password;
    delete sanitized.__v;
    return sanitized;
  },
});

const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
