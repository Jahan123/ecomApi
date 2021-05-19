import passport from "passport";
import { Strategy } from "passport-github";
import { User } from "../models";
import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  GITHUB_SUCCESS_URL,
} from "../constant";

const GithubAuthStaregy = passport.use(
  new Strategy(
    {
      clientID: GITHUB_CLIENT_ID,
      clientSecret: GITHUB_CLIENT_SECRET,
      callbackURL: GITHUB_SUCCESS_URL,
    },
    (accessToken, refreshToken, profile, cb) => {
      try {
        User.findOne(
          {
            "socialLoginInfo.loginUserDetails.id": profile._json.id,
          },
          (err, user) => {
            if (err) return cb(err);

            if (!user) {
              const { id, login, avatar_url, url } = profile._json;
              const newUser = new User({
                loginType: "social-login",
                isActive: true,
                "socialLoginInfo.loginType": profile.provider,
                "socialLoginInfo.loginUserDetails": {
                  id,
                  username: login,
                  avatar: avatar_url,
                  github_url: url,
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
        console.log("github_login_error" + err);
        cb(err, null);
      }
    }
  )
);
export default GithubAuthStaregy;
