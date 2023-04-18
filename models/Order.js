const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    product_id: { type: Schema.Types.ObjectId, ref: "products" },
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    status: { type: Number },
    admin_id: { type: Schema.Types.ObjectId, ref: "admins" },
    description: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("orders", OrderSchema);
