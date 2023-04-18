const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "products" },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    description: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("orders", OrderSchema);
