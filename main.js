const express = require("express");
const app = express();
const router = require("./src/routes/index");

const dbConfig = require("./config/database.json");
const mongoose = require("mongoose");

const bodyParser = require("body-parser")
const engine = require("ejs-mate")

const sessionMiddleware = require("./config/session");
const authMiddleware = require("./config/auth");

//static files
app.use("/public", express.static("public"));

//template engine
app.engine("ejs", engine);
app.set("views", "./src/views");
app.set("view engine", "ejs");

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

//set active path
app.use(function (req, res, next) {
  res.locals.active = req.path;
  next();
})

// add & configure session middleware and authentication
app.use(sessionMiddleware);
app.use(authMiddleware);

//routes
app.use(router);

//server
const APP_PORT = 3000;
const database = `mongodb://${dbConfig.host}/${dbConfig.dbname}`;

console.log(`Database config: ${database}`);
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(function () {
    console.log("App is now connected to database");
    app.listen(APP_PORT, function () {
      console.log(`Server up and running on: http://localhost:${APP_PORT}/`);
    });
  })
  .catch(function (err) {
    console.log("Database connexion error");
    console.log(err);
  })
