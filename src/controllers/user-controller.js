import { User } from "../models";
import SendMail from "../functions/verification-email-functions";
import { APP_DOMAIN, TOKEN_SECRET_KEY, REFRESH_SECRET_KEY } from "../constant";
import { randomBytes } from "crypto";
import fs from "fs";
import {
  ACCOUNT_SECRET,
  ACCOUNT_SID,
  TWILIO_PHONE_NUMBER,
  CLOUD_API_NAME,
  CLOUD_API_KEY,
  CLOUD_API_SECRET,
} from "../constant";
import twilio from "twilio";
import cloudinary from "cloudinary";

cloudinary.config({
  cloud_name: CLOUD_API_NAME,
  api_key: CLOUD_API_KEY,
  api_secret: CLOUD_API_SECRET,
});

const removeFileFromTmp = (path) => {
  fs.unlink(path, (err) => {
    if (err) throw err;
  });
};

const UserController = {
  login: async (req, res) => {
    try {
      const user = req.user;
      const AccessToken = await User.generateToken(
        user,
        TOKEN_SECRET_KEY,
        "1d"
      );
      const refreshToken = await User.generateToken(
        user,
        REFRESH_SECRET_KEY,
        "7d"
      );
      res.cookie("refresh_token_login", refreshToken);
      return res.status(200).json({ user, token: AccessToken });
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message, status: false });
    }
  },
  logout: (req, res) => {
    console.log("hello");
    const refreshToken = req.cookies.refresh_token_login;
    console.log(refreshToken);
    if (refreshToken) {
      res.clearCookie("refresh_token_login");
      req.session.destroy();
      return res
        .status(200)
        .json({ message: "User Logout Successfully", status: true });
    } else {
      return res
        .status(400)
        .json({ message: "YOU ARE NOT LOGIN NOW", status: false });
    }
  },
  register: async (req, res) => {
    try {
      const { name, email, username, password } = req.body;
      if (await User.checkForData(username, "username")) {
        return res
          .status(400)
          .json({ message: "Username Already exists", status: false });
      } else if (await User.checkForData(email, "email")) {
        return res
          .status(400)
          .json({ message: "Email Already exists", status: false });
      } else {
        const user = await User({
          name,
          email,
          username,
          password,
          verificationCode: randomBytes(20).toString("hex"),
        });
        const createdUser = await user.save();
        const from = "zainab.ali8102@gmail.com";
        const to = createdUser.email;
        const subject = "Email Verification";
        const text = "Please Verify Email";
        const html = `
         <h1>Email Verfification</h1>
         <p>Welcome ${createdUser.name},Verify Email By Clickcing Below Link!!!</p>
         <a href="${APP_DOMAIN}/users/email-verfication/${createdUser.verificationCode}">Verfify Email</a>
       `;
        SendMail(to, from, subject, text, html);
        const AccessToken = await User.generateToken(
          createdUser,
          TOKEN_SECRET_KEY,
          "1d"
        );
        const refreshToken = await User.generateToken(
          createdUser,
          REFRESH_SECRET_KEY,
          "7d"
        );
        res.cookie("refresh_token", refreshToken);
        return res.status(201).json({
          message:
            "User Registered Successfully,please check your email and verify yourself",
          status: true,
          registerToken: AccessToken,
          user: createdUser,
        });
      }
    } catch (err) {
      console.log(err);
      return res.status(400).json({ message: err.message, status: false });
    }
  },
  verifyUserEmail: async (req, res) => {
    const { code } = req.params;
    const user = await User.checkForData(code, "verificationCode");

    if (!user) {
      return res.status(404).json({
        message: "Something Went Wrong,Sorry Data Not Found..",
        status: false,
      });
    }
    user.isActive = true;
    user.verificationCode = undefined;
    const verifiedUser = await user.save();
    return res.status(200).json({
      message: "SuccessFully Verified Email",
      status: true,
      user: verifiedUser,
    });
  },
  refreshTokenVerify: async (req, res) => {
    const user = req.user;
    const checkUser = await User.checkForData(user.isActive, "isActive");
    if (!checkUser.isActive) {
      return res.status(401).json({
        message: "Please Verify Email First ANd then Access this Link",
      });
    }
    return res.status(200).json({ user });
  },
  loginWithOTP: async (req, res) => {
    const client = new twilio(ACCOUNT_SID, ACCOUNT_SECRET);
    const otp = Math.floor(10000 + Math.random() * 90000);
    const { phone } = req.body;
    console.log(otp);
    const AccessToken = await User.generateToken(
      { phone, otp },
      TOKEN_SECRET_KEY,
      "1h"
    );
    const refreshToken = await User.generateToken(
      { phone, otp },
      REFRESH_SECRET_KEY,
      "2h"
    );
    res.cookie("user_login_token", refreshToken, { httpOnly: true });
    const body = `Your login OTP is ${otp}`;
    client.messages
      .create({
        body,
        to: phone,
        from: TWILIO_PHONE_NUMBER,
      })
      .then((message) => {
        return res.status(200).json({
          message: "Otp send SuccessFully",
          phone,
          otp,
          token: AccessToken,
        });
      })
      .catch((err) => console.log(err));
  },
  VerifyOtp: async (req, res) => {
    const tokenValue = req.tokenValue;
    if (tokenValue.otp === req.body.otp) {
      const user = new User({
        "otpDetails.phone": tokenValue.phone,
        isActive: true,
        loginType: "otp-login",
      });
      await user.save();
      return res
        .status(200)
        .json({ message: "User Verify Successfully", user });
    } else {
      return res.status(400).json({ message: "not valid otp code" });
    }
  },
  uploadImage: (req, res) => {
    try {
      const image = req.files.avatar;
      if (!req.files || Object.keys(req.files).length === 0) {
        removeFileFromTmp(image.tempFilePath);
        return res
          .status(404)
          .json({ message: "You have not select any file" });
      }
      if (
        !image.mimetype === "image/jpg" ||
        !image.mimetype === "image/png" ||
        !image.mimetype === "image/jpeg"
      ) {
        removeFileFromTmp(image.tempFilePath);
        return res
          .status(400)
          .json({ message: "Image Extension is Not Valid" });
      }
      if (image.size > 1024 * 1024) {
        removeFileFromTmp(image.tempFilePath);
        return res.status(400).json({ message: "Image Size is too big" });
      }
      cloudinary.v2.uploader.upload(
        image.tempFilePath,
        { folder: "image_upload" },
        (err, result) => {
          if (err) throw err;
          removeFileFromTmp(image.tempFilePath);
          return res.status(200).json({ message: "file uploaded!!", result });
        }
      );
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
  deleteImage: (req, res) => {
    try {
      const { public_id } = req.body;
      cloudinary.v2.uploader.destroy(public_id, (err, result) => {
        if (err) throw err;
        return res.status(200).json({ message: "Image Deleted Successfully" });
      });
    } catch (err) {
      return res.status(400).json({ message: err.message });
    }
  },
};
export default UserController;
