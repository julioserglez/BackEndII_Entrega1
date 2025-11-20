import { Schema, model } from "mongoose";

const UserSchema = new Schema({
  first_name: { type: String, required: true, trim: true },
  last_name: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true, lowercase: true },
  age: { type: Number, required: true },
  password: { type: String, required: true },
  cart: { type: Number },
  role: { type: String, enum: ['user','admin'], default: 'user' }
});

export default model("User", UserSchema);
