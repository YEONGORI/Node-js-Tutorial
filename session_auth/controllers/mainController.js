const session = require("express-session");

module.exports.main_get = (req, res) => {
  console.log(req.query.id);
  res.render("index");
};
