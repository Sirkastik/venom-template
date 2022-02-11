const mongoose = require('mongoose');
// const Todo = require('./Todo');
const Schema = mongoose.Schema;

const UserSchema = Schema({
  username: String,
  password: String,
  createdAt: {type: Date,default: Date.now},
  todos: [{ type: Schema.Types.ObjectId, ref: 'todo' }]
});

module.exports = User = mongoose.model('user', UserSchema)