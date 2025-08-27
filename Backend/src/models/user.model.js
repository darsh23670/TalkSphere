import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  token: { type: String },
});

const User = mongoose.model("User", userSchema); //A Model is a constructor function that lets you create, query, update, and delete documents in MongoDB."User" → collection name (MongoDB will save it as users by default, lowercase & pluralized).userSchema → blueprint of how each document inside users collection must look.

export { User }; // if u use default u can export only one thing so we need to export all data here so user in curly braces
