const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const TodoSchema = Schema({
    description: String,
    date: { type: Date, default: Date.now },
    user: { type: Schema.Types.ObjectId, ref: 'user' },
});


module.exports = Todo = mongoose.model('todo', TodoSchema)
