// passport middleware
const passport = require("passport");
const localStorage = require("passport-local");
const passportJwt = require("passport-jwt");
const ExtractJwt = passportJwt.ExtractJwt;
const jwtStrategy = passportJwt.Strategy;

// User model
const User = require("../models/User");

passport.use(
  "signup",
  new localStorage(
    {
      userIdField: "user_id",
      passwordField: "password",
      nicknameField: "nickname",
    },
    async (user_id, password, nickname, done) => {
      try {
        const user = await User.create({ user_id, password, nickname });
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "login",
  new localStorage(
    {
      usernameField: "user_id",
      passwordField: "password",
    },
    async (user_id, password, done) => {
      try {
        const user = await User.findOne({ user_id });
        if (!user) {
          return done(null, false, { message: "ID가 존재하지 않습니다." });
        }
        const validate = await user.isValidPassword(password);
        if (!validate) {
          return done(null, false, { message: "비밀번호가 맞지 않습니다" });
        }
        return done(null, user, { message: "로그인 성공" });
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromUrlQueryParameter("secret_token"),
      secretOrKey: "TOP_SECRET",
    },
    async (token, done) => {
      try {
        return done(null, token.user);
      } catch (err) {
        done(err);
      }
    }
  )
);
