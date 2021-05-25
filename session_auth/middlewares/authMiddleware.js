const session = require("express-session");

const requireAuth = (req, res, next) => {
  const cookie = req.cookies;
  console.log(cookie);

  const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      res.redirect("/auth/login");
    }
  };

  if (cookie) {
    req.session.isAuth;
  } else {
    res.redirect("/auth/login");
  }
  next();
};
