import { Product } from "../models";

class APIFeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query.sort(sortBy);
    } else {
      this.query.sort("-createdAt");
    }
    return this;
  }
  filtering() {
    const queryObject = { ...this.queryString };
    const excludedField = ["page", "sort", "limit"];
    excludedField.forEach((el) => delete queryObject[el]);
    let queryStr = JSON.stringify(queryObject);
    queryStr = queryStr.replace(
      /\b(lt|lte|gt|gte|regex)\b/g,
      (match) => "$" + match
    );
    console.log(JSON.parse(queryStr));
    this.query.find(JSON.parse(queryStr));
    return this;
  }
  paginating() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 1;
    const skip = (page - 1) * limit;
    this.query.skip(skip).limit(limit);
    return this;
  }
}

const productController = {
  showProduct: async (req, res) => {
    try {
      const feature = new APIFeature(Product.find(), req.query)
        .filtering()
        .paginating()
        .sorting();
      const product = await feature.query;
      console.log(product);
      return res.status(200).json({
        message: "Product Fetched Succesfully",
        result: product.length,
        product,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        image,
        category,
        content,
      } = req.body;
      const product = await Product.findOne({ product_id });
      if (product) {
        return res.status(400).json({ message: "Product already exists" });
      }
      const newProduct = new Product({
        product_id,
        title,
        price,
        description,
        image,
        category,
        content,
      });
      const createdProduct = await newProduct.save();
      return res.status(201).json({
        message: "Product created Successfully",
        product: createdProduct,
      });
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: error.message });
    }
  },
  showProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      const showProduct = await Product.findById(productId);
      return res.status(200).json({
        message: "Product Fetched Successfully",
        product: showProduct,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  updateProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      console.log(req.body.price);
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { ...req.body },
        { new: true }
      );
      return res.status(200).json({
        message: "Product updated Successfully",
        product: updatedProduct,
      });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
  deleteProductById: async (req, res) => {
    try {
      const { productId } = req.params;
      await Product.findByIdAndRemove(productId);
      return res.status(200).json({ message: "Product Deleted Successfully" });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};

export default productController;
