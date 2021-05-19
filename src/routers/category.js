import { Router } from "express";
import CategoryController from "../controllers/category-controller";
import CheckForAdmin from "../middleware/check-for-admin";
import passport from "passport";

const router = Router();

router.get(
  "/all-category",
  passport.authenticate("jwt", { session: false }),
  CategoryController.getAllCategory
);
router.post(
  "/create-category",
  passport.authenticate("jwt", { session: false }),
  CheckForAdmin,
  CategoryController.createCategory
);
router.get(
  "/show-category/:categoryId",
  passport.authenticate("jwt", { session: false }),
  CheckForAdmin,
  CategoryController.showCategory
);
router.put(
  "/update-category/:categoryId",
  passport.authenticate("jwt", { session: false }),
  CheckForAdmin,
  CategoryController.updateCategory
);
router.delete(
  "/delete-category/:categoryId",
  passport.authenticate("jwt", { session: false }),
  CheckForAdmin,
  CategoryController.deleteCategory
);
export default router;
