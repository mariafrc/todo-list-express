const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;
