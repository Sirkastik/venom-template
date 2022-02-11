const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

// Todo Model
const Todo = require('../../models/Todo')
// User Model
const User = require('../../models/User')
const JWT_KEY = require('../../config/keys').JWT_KEY;



// @route GET api/users/todos/userID
// @desc Get All todos of a user
// @access Public
router.get('/', (req, res) => {
    try {
        Todo.find()
            .then((todos) => res.json(todos))
    } catch (error) {
        res.status(401).json({ error: error });
    }
})

// @route GET api/users/todos/userID
// @desc Get All todos of a user
// @access Private
router.get('/:userID', (req, res) => {
    const { authorization } = req.headers
    const [, token] = authorization.split(" ")
    try {
        jwt.verify(token, JWT_KEY)
        Todo.find().where('user', req.params.userID)
            .then((todos) => res.json(todos))
    } catch (error) {
        res.status(401).json({ error: error });
    }
})

// @route POST api/users/todos/userID
// @desc Create a todo for a user
// @access Private
router.post('/:userID', (req, res) => {
    User.findById(req.params.userID, (err, user) => {
        if (err) res.status(404).json({ error: error })
        else {
            const newTodo = new Todo({
                description: req.body.description,
                user: req.params.userID
            });
            user.todos.unshift(newTodo)
            user.save((err) => {
                if (err) res.status(401).json({ error: error })
                else {
                    newTodo.save((err, todo) => {
                        if (err) res.status(401).json({ error: error })
                        else
                            res.json({ todo })
                    })
                }
            })
        }
    })
})

// @route DELETE api/users/todos
// @desc Delete a todo
// @access Public
router.delete('/:id', (req, res) => {
    Todo.findById(req.params.id)
        .then(todo => todo.remove((err, todo) => {
            if (err) res.status(404).json({ error: error })
            else {
                User.findById(todo.user, (err, user) => {
                    if (err) res.status(404).json({ error: error })
                    else {
                        const index = user.todos.indexOf(req.params.id)
                        user.todos.splice(index, 1)
                        user.save((err, user) => {
                            if (err) res.status(404).json({ error: error })
                            else
                                res.json(user)
                        })
                    }
                })
            }
        }))
        .catch(err => res.status(404).json({
            success: false
        }))
})

module.exports = router;