const express = require("express");
const router = express.Router();

//declarations
const todoRoute = require("./routes/todo.route");
router.use(todoRoute);
const categoryRoute = require("./routes/category.route");
router.use(categoryRoute);

//404 redirect
router.use(function(req, res, next) {
  res.status(404);

  // respond with html page
  if (req.accepts('html')) {
    res.render('error/404', { url: req.url });
    return;
  }

  // respond with json
  if (req.accepts('json')) {
    res.json({ error: 'Not found' });
    return;
  }
});

module.exports = router;