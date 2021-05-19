import { verify } from "jsonwebtoken";
import { REFRESH_SECRET_KEY } from "../constant";

const CheckOTPTokenMiddleware = async (req, res, next) => {
  try {
    const userLoginToken = req.cookies.user_login_token;
    if (!userLoginToken) {
      return res.status(404).json({ message: "Token Not Found" });
    }
    const data = await verify(userLoginToken, REFRESH_SECRET_KEY);
    console.log(data);
    req.tokenValue = data;
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
  next();
};

export default CheckOTPTokenMiddleware;
