const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }
});

const TodoModel = mongoose.model('Todo', todoSchema);
module.exports = TodoModel;
