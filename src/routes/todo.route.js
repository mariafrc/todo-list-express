const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo.model");

router.get("/todo", function(req, res){
  TodoModel.find()
    .then(function(response){
      res.render("todo/list", {todos: response});
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.get("/todo/add", function(req, res){
  res.render("todo/form", {addAction: true})
})

router.get("/todo/edit/:todoId", function(req, res){
  TodoModel.findOne({_id: req.params.todoId})
    .then(function(response){
      res.render("todo/form", {addAction: false, todo: response})
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
    TodoModel.updateOne({_id: req.body._id}, {task: req.body.task})
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