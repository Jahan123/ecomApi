import { Router } from "express";
import ProductController from "../controllers/product-controller";

const router = Router();

router.get("/", ProductController.showProduct);
router.post("/create-product", ProductController.createProduct);
router.get("/show-product/:productId", ProductController.showProductById);
router.put("/update-product/:productId", ProductController.updateProductById);
router.delete(
  "/delete-product/:productId",
  ProductController.deleteProductById
);

export default router;
