const express = require("express");
const router = express.Router();
const CategoryModel = require("../models/category.model");

router.get("/category", function(req, res){
  CategoryModel.find()
    .then(function(response){
      res.render("category/list", {categories: response});
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.get("/category/add", function(req, res){
  res.render("category/form", {addAction: true})
})

router.get("/category/edit/:categoryId", function(req, res){
  CategoryModel.findOne({_id: req.params.categoryId})
    .then(function(response){
      res.render("category/form", {addAction: false, category: response})
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.post("/category/submit", function(req, res){
  if(req.body.action === "add"){
    CategoryModel.create({ name: req.body.name })
      .then(function(){
        res.redirect("/category");
      })
      .catch(function(err){
        console.log(err);
        res.render("error/500");
      })
  } else {
    CategoryModel.updateOne(
      {_id: req.body._id}, 
      {
        name: req.body.name
      }
    )
      .then(function(){
        res.redirect("/category");
      })
      .catch(function(err){
        console.log(err);
        res.render("error/500");
      })
  }
})

router.post("/category/delete", function(req, res){
  CategoryModel.deleteOne({_id: req.body._id})
    .then(function(){
      res.redirect("/category");
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

module.exports = router;