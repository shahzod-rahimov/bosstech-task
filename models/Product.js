const { Schema, model } = require("mongoose");

const ProductSchema = new Schema(
  {
    name: { type: String },
    price: { type: Number },
    description: { type: String },
    image: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("products", ProductSchema);
