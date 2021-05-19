import { Strategy, ExtractJwt } from "passport-jwt";
import { TOKEN_SECRET_KEY } from "../constant";
import passport from "passport";
import { User } from "../models";

const ops = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: TOKEN_SECRET_KEY,
};

const passportConfig = passport.use(
  new Strategy(ops, async (payload, done) => {
    try {
      const user = await User.findOne({ _id: payload._doc._id });
      console.log(payload);
      console.log(user);
      if (!user) {
        console.log("hello");
        done(null, false);
      } else {
        done(null, user);
      }
    } catch (err) {
      done(err, false);
    }
  })
);
export default passportConfig;
