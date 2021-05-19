import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../models";
import {
  GOOGLE_AUTH_CLIENT_ID,
  GOOGLE_AUTH_CLIENT_SECRET,
  FALLBACK_URL,
} from "../constant";

const GoogleAuthStaregy = passport.use(
  new Strategy(
    {
      clientID: GOOGLE_AUTH_CLIENT_ID,
      clientSecret: GOOGLE_AUTH_CLIENT_SECRET,
      callbackURL: FALLBACK_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      try {
        const user = User.findOne(
          {
            "socialLoginInfo.loginUserDetails.id": profile.id,
          },
          (err, user) => {
            if (err) return cb(err);
            if (!user) {
              const { sub, name, picture } = profile._json;
              const newUser = new User({
                loginType: "social-login",
                isActive: true,
                "socialLoginInfo.loginType": profile.provider,
                "socialLoginInfo.loginUserDetails": {
                  id: sub,
                  name,
                  avatar: picture,
                },
              });
              newUser.save((err) => {
                if (err) return cb(err);
                return cb(err, user);
              });
            } else {
              return cb(err, user);
            }
          }
        );
      } catch (err) {
        console.log("google_login_error" + err);
        cb(err, null);
      }
    }
  )
);
export default GoogleAuthStaregy;
