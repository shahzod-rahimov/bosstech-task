const { Schema, model } = require("mongoose");

const OperationSchema = new Schema(
  {
    status: { type: Number },
    order_id: { type: Schema.Types.ObjectId, ref: "orders" },
    admin_id: { type: Schema.Types.ObjectId, ref: "admins" },
    description: { type: String },
  },
  { versionKey: false, timestamps: true }
);

module.exports = model("operations", OperationSchema);
