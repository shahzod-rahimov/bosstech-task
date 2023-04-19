const { Schema, model } = require("mongoose");

const OrderSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "users" },
    // 1 -> "pending", 2 -> "processing", 3 -> "shipped", 4 -> "delivered"
    status: { type: Number, enum: [1, 2, 3, 4], default: 1 },
    admin_id: { type: Schema.Types.ObjectId, ref: "admins" },
    description: { type: String },
    products: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: "products",
          required: true,
        },
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("orders", OrderSchema);
