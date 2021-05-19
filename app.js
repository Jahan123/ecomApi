import express from "express";
import { PORT, MONGOOSE_PATH } from "./src/constant";
import cors from "cors";
import mongoose from "mongoose";
import fileuploads from "express-fileupload";
import cookieParser from "cookie-parser";
import { json } from "body-parser";
import { success, error } from "consola";
import UserRoute from "./src/routers/user";
import CategoryRoute from "./src/routers/category";
import ProductRoute from "./src/routers/product";
import passport from "passport";
import "./src/functions/passportGoogle";
import "./src/functions/PassportSetup";
import "./src/functions/passportLocal";
import "./src/functions/passportGithub";
import session from "express-session";
import { User } from "./src/models";
const app = express();
app.use(cors());
app.use(json());
app.use(
  session({
    secret: "SESSION TOKEN",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(
  fileuploads({
    useTempFiles: true,
    tempFileDir: "uploads/",
    preserveExtension: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function (user, cb) {
  cb(null, user.id);
});
passport.deserializeUser(function (id, cb) {
  User.findById(id, function (err, user) {
    if (err) {
      return cb(err);
    }
    cb(null, user);
  });
});
app.use("/users", UserRoute);
app.use("/categories", CategoryRoute);
app.use("/products", ProductRoute);
app.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});
app.use((error, req, res, next) => {
  console.log(error);
  res
    .status(error.status || 500)
    .json({ error: { message: error.message, status: false } });
});

const main = async () => {
  try {
    await mongoose.connect(MONGOOSE_PATH, {
      useFindAndModify: false,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    success({ message: "Database is Connected Successfully", badge: true });
    app.listen(PORT, () =>
      success({ message: `App Running on Port ${PORT}`, badge: true })
    );
  } catch (err) {
    error({ message: err.message, badge: true });
  }
};
main();
