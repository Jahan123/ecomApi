import { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    product_id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    checked: {
      type: Boolean,
      default: false,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },
    sold: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

export default Product;
