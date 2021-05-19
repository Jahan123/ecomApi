import { check } from "express-validator";

const username = check("username", "Username Is Required")
  .not()
  .isEmpty()
  .isLength({ min: 5 })
  .withMessage("Username Atleast 5 Charecter")
  .matches(/^[a-zA-Z0-9]+$/)
  .withMessage("Must Be Charecter Or Digits")
  .trim()
  .withMessage("Please Delete All Backspaces from username");
const email = check("email", "Email is Required")
  .not()
  .isEmpty()
  .isEmail()
  .withMessage("Email Must Be valid")
  .trim();
const name = check("name", "Name is Required")
  .not()
  .isEmpty()
  .trim()
  .withMessage("Must Be remove Space from Name")
  .matches(/^[a-zA-Z\-\s]+$/)
  .withMessage("Must Contain Only Charecter");

const password = check("password", "Password is Required")
  .not()
  .isEmpty()
  .isLength({ min: 8, max: 20 })
  .withMessage("Must Be atleast 8 charecters and maximum 20 charecter ")
  .matches(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/)
  .withMessage(
    "Must be have  digits one spacial charecter and lower and upercase charecter and minimun 8 charecter"
  );

export const RegisterValidation = [name, username, email, password];
export const AuthenticationValidation = [username, password];
