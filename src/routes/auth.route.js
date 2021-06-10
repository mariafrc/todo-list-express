const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");
const bcrypt = require("bcrypt");

router.get("/login", function(req, res){
  res.render("pages/login");
})

router.get("/register", function(req, res){
  res.render("pages/register");
})

router.post("/register", function(req, res){
  UserModel.findOne({username: req.body.username})
    .then(function(user){
      if(user){
        res.render("pages/register", {errorMessage: "username already exist"})
      } else {
        UserModel.create({
          username: req.body.username,
          password: bcrypt.hashSync(req.body.password, 14)
        })
          .then(function(user){
            req.session.userId = user._id;
            req.session.isLoggedIn = true;
            res.redirect("/todo");
          })
          .catch(function(err){
            console.log(err);
            res.render("error/500");
          })
      }
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.post("/login", async function(req, res){
  UserModel.findOne({username: req.body.username})
    .then(function(user){
      console.log(user, req.body)
      if(!user){
        res.render("pages/login", {
          errorMessage: "user not found", 
          username: req.body.username
        })
      } else if(!bcrypt.compareSync(req.body.password, user.password)){
        res.render("pages/login", {
          errorMessage: "invalid password", 
          username: req.body.username
        })
      } else {
        req.session.userId = user._id;
        req.session.isLoggedIn = true;
        res.redirect("/todo");
      }
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.get("/logout", function(req, res){
  req.session.destroy(function(err) {
    if(err){
      console.log(err);
      res.render("error/500");
    } else {
      res.redirect("/login");
    }
  })
})

module.exports = router;