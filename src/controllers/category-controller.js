import { Category } from "../models";
const CategoryController = {
  getAllCategory: async (req, res) => {
    const allCategory = await Category.find();
    return res
      .status(200)
      .json({ message: "All Category", category: allCategory });
  },
  deleteCategory: async (req, res) => {
    const { categoryId } = req.params;
    await Category.findOneAndRemove({ _id: categoryId });
    return res
      .status(200)
      .json({ message: "Delete Category successfully", success: true });
  },
  updateCategory: async (req, res) => {
    const { categoryId } = req.params;
    const updateCategory = await Category.findOneAndUpdate(
      { _id: categoryId },
      { name: req.body.name },
      { new: true }
    );
    return res.status(200).json({
      message: "Category updated successfully",
      category: updateCategory,
      success: true,
    });
  },
  showCategory: async (req, res) => {
    const { categoryId } = req.params;
    const category = await Category.findById(categoryId);
    if (!category) {
      return res.status(404).json({ message: "Category Not Found" });
    }
    return res
      .status(200)
      .json({ message: "Category Found Successfully", status: true, category });
  },
  createCategory: async (req, res) => {
    const { name } = req.body;
    const checkCategory = await Category.findOne({ name: name });
    if (checkCategory) {
      return res
        .status(404)
        .json({ message: "Category Already Exists", status: false });
    }
    const category = new Category({ name });
    const newCategory = await category.save();
    return res.status(200).json({
      message: "Created Category",
      success: true,
      category: newCategory,
    });
  },
};

export default CategoryController;
