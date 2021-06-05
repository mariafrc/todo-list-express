const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo.model");
const CategoryModel = require("../models/category.model");

router.get("/todo", function(req, res){
  TodoModel.find()
    .populate("category")
    .then(function(response){
      res.render("todo/list", {todos: response});
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.get("/todo/add", function(req, res){
  CategoryModel.find()
    .then(function(response){
      res.render("todo/form", {addAction: true, categories: response})
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.get("/todo/edit/:todoId", function(req, res){
  Promise.all([
    CategoryModel.find(),
    TodoModel.findOne({_id: req.params.todoId})
  ])
    .then(function([categories, todo]){
      if(categories.length > 0 && todo.category){
        categories.forEach(function(category){
          if(category._id.toString() === todo.category.toString()){
            category.selected = true
          }
        })
      }
      res.render("todo/form", {
        addAction: false, 
        categories: categories,
        todo: todo
      })
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.post("/todo/submit", function(req, res){
  if(req.body.action === "add"){
    TodoModel.create({
      task: req.body.task,
      category: req.body.category || null,
      completed: false
    })
      .then(function(){
        res.redirect("/todo");
      })
      .catch(function(err){
        console.log(err);
        res.render("error/500");
      })
  } else {
    TodoModel.updateOne(
      {_id: req.body._id}, 
      {
        task: req.body.task, 
        category: req.body.category || null
      }
    )
      .then(function(){
        res.redirect("/todo");
      })
      .catch(function(err){
        console.log(err);
        res.render("error/500");
      })
  }
})

router.post("/todo/delete", function(req, res){
  TodoModel.deleteOne({_id: req.body._id})
    .then(function(){
      res.redirect("/todo");
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

module.exports = router;