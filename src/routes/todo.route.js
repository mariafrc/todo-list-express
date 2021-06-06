const express = require("express");
const router = express.Router();
const TodoModel = require("../models/todo.model");
const CategoryModel = require("../models/category.model");

function getTodoFilter(requestQuery){
  let filter = {};
  if(requestQuery.task){
    filter.task = { $regex: requestQuery.task, $options: "i" } ;
  }
  if(requestQuery.category){
    filter.category = requestQuery.category;
  }
  return filter;
}

router.get("/todo", function(req, res){
  const requestQuery = req.query;
  const todoFilter = getTodoFilter(requestQuery);

  Promise.all([
    CategoryModel.find(),
    TodoModel.find(todoFilter).populate("category")
  ])
    .then(function(response){
      let categories = response[0];
      let todos = response[1];
      if(categories.length > 0 && requestQuery.category){
        categories.forEach(function(category){
          if(category._id.toString() === requestQuery.category){
            category.selected = true
          }
        })
      }
      res.render("pages/todo/list", {categories: categories, todos: todos, query: requestQuery});
    })
    .catch(function(err){
      console.log(err);
      res.render("error/500");
    })
})

router.get("/todo/add", function(req, res){
  CategoryModel.find()
    .then(function(response){
      res.render("pages/todo/form", {addAction: true, categories: response})
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
    .then(function(response){
      let categories = response[0];
      let todo = response[1];

      if(categories.length > 0 && todo.category){
        categories.forEach(function(category){
          if(category._id.toString() === todo.category.toString()){
            category.selected = true
          }
        })
      }
      res.render("pages/todo/form", {
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