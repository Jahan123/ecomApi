import { Schema, model } from "mongoose";

const CartSchema = new Schema(
  {
    user_details: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    product_details: {
      type: Schema.Types.ObjectId,
      ref: "Product",
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", CartSchema);
