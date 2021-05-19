import { Strategy } from "passport-local";
import passport from "passport";
import { User } from "../models";

const LocalStartegiesPassport = passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user = await User.checkForData(username, "username");
      if (!user) {
        return done(null, false);
      }
      const checkPassword = await User.comparePassword(password, user.password);
      if (!checkPassword) {
        return done(null, false);
      }
      return done(null, user);
    } catch (err) {
      console.log(err);
      return done(err, false);
    }
  })
);
export default LocalStartegiesPassport;
