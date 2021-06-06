const express = require("express");
const router = express.Router();
const UserModel = require("../models/user.model");

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
          password: req.body.password
        })
          .then(function(user){
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
      } else if(user.password !== req.body.password){
        res.render("pages/login", {
          errorMessage: "invalid password", 
          username: req.body.username
        })
      } else {
        res.redirect("/todo");
      }
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

module.exports = router;