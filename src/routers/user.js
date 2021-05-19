import { Router } from "express";
import CategoryController from "../controllers/category-controller";
import CheckForAdmin from "../middleware/check-for-admin";
import passport from "passport";
import UserController from "../controllers/user-controller";
import CheckOTPTokenMiddleware from "../middleware/check_otp_token";
import {
  RegisterValidation,
  AuthenticationValidation,
} from "../middleware/user-input.check";
import CheckUserInputValidationErrors from "../middleware/fetch-validation-errors";
const router = Router();
router.post(
  "/login",
  AuthenticationValidation,
  CheckUserInputValidationErrors,
  passport.authenticate("local", { failureRedirect: "/users/login" }),
  UserController.login
);

router.post(
  "/register",
  RegisterValidation,
  CheckUserInputValidationErrors,
  UserController.register
);
router.get("/email-verification/:code", UserController.verifyUserEmail);
router.get(
  "/refresh_token",
  passport.authenticate("jwt", { session: false }),
  UserController.refreshTokenVerify
);
router.get("/logout", UserController.logout);

router.get(
  "/google-login",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/success-google-login",
  passport.authenticate("google", { failureRedirect: "/google-login/fail" }),
  (req, res, next) => {
    const user = req.user;
    console.log(user);
    if (req.isAuthenticated()) {
      return res.status(200).json({ message: "successfull login", user });
    }
    return res.status(400).json({ error: "Error Occure" });
  }
);
router.get("/google-login/fail", (req, res) => {
  res.status(400).json({ message: "Error Occure on Login" });
});
router.get("/google-logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).json({ message: "User Logout successfully" });
  } else {
    return res.status(400).json({ message: "You are not login" });
  }
});
router.get("/auth/github-login", passport.authenticate("github"));
router.get(
  "/success-github-login",
  passport.authenticate("github", {
    failureRedirect: "/users/auth/github-login-fail",
  }),
  (req, res) => {
    const user = req.user;
    if (req.isAuthenticated()) {
      return res.status(200).json({ message: "successfull login", user });
    }
    return res.status(400).json({ message: "UnAuthorized" });
  }
);
router.get("/auth/github-login-fail", (req, res) => {
  res.status(400).json({ message: "Error Occure on Login" });
});
router.get("/auth/github-logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.logout();
    return res.status(200).json({ message: "User Logout successfully" });
  } else {
    return res.status(400).json({ message: "You are not login" });
  }
});

router.post("/login-with-otp", UserController.loginWithOTP);
router.post("/verify-otp", CheckOTPTokenMiddleware, UserController.VerifyOtp);

router.post(
  "/upload-image",
  passport.authenticate("jwt", { session: false }),
  CheckForAdmin,
  UserController.uploadImage
);
router.post(
  "/delete-uploaded-image",
  passport.authenticate("jwt", { session: false }),
  CheckForAdmin,
  UserController.deleteImage
);

export default router;
