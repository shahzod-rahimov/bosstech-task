const { Schema, model } = require("mongoose");

const AdminSchema = new Schema(
  {
    full_name: { type: String },
    email: { type: String, unique: true, required: true },
    password: {
      type: String,
      min: [6, "Must be at least 6, got {VALUE}"],
      max: [20, "Must be less than 20, got {VALUE}"],
    },
    refresh_token: { type: String },
    is_admin: { type: Boolean, default: true },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = model("admins", AdminSchema);
