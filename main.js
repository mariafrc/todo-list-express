const express = require('express');
const app = express();
const router = require("./src/router");

const dbConfig = require("./database.json");
const mongoose = require("mongoose");

const bodyParser = require('body-parser')
const engine = require('ejs-mate')

//static files
app.use('/public', express.static('public'));

//template engine
app.engine('ejs', engine);
app.set('views', './src/views');
app.set('view engine', 'ejs');

// parse requests of content-type - application/json
app.use(bodyParser.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
//set active path
app.use(function(req, res, next){
  res.locals.active = req.path;
  next();
})

//routes
app.use(router);

//server
const APP_PORT = 3000;
const database = `mongodb://${dbConfig.host}/${dbConfig.dbname}`;
mongoose
  .connect(database, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(function(){
    console.log("Connexion à mongodb ok");
    console.log(`Configuration: ${database}`);
    app.listen(APP_PORT, function () {
      console.log(`Server up and running on: http://localhost:${APP_PORT}/`);
    });
  })
  .catch(function(err){
    console.log("Erreur lors de la connexion à mongodb");
    console.log(`Configuration: ${database}`);
    console.log(err);
  })
