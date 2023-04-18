const { Schema, model } = require("mongoose");

const UserSchema = new Schema(
  {
    full_name: { type: String },
    email: { type: String, unique: true, required: true },
    phone_number: { type: String, unique: true },
    password: {
      type: String,
      min: [6, "Must be at least 6, got {VALUE}"],
      max: [20, "Must be less than 20, got {VALUE}"],
    },
    refresh_token: { type: String },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("users", UserSchema);
