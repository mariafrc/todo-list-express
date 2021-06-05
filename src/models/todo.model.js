const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;
