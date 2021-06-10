const excludePaths = [
  "/login",
  "/register"
]

module.exports = function(req, res, next){
  if(!excludePaths.includes(req.path) && !req.session.isLoggedIn){
    res.redirect("/login");
  } else {
    next();
  }
}