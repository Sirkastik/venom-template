const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken')

const todos = require('./todos')

// User Model
const User = require('../../models/User')
const JWT_KEY = require('../../config/keys').JWT_KEY;

router.use('/todos', todos)

// @route GET api/users
// @desc Get All users
// @access Public
router.get('/', (req, res) => {
    User.find()
        .sort({ date: -1 })
        .then(users => res.json(users))
})


// @route POST api/users/signup
// @desc Create a user
// @access Public
router.post('/signup', (req, res) => {
    const newUser = new User({
        username: req.body.username,
        password: req.body.password,
    })

    newUser.save((err, user) => {
        if (err) res.status(404).json({ error: error })
        else {
            const token = jwt.sign(user.toObject(), JWT_KEY)
            res.json({
                message: "Signup Sucess",
                token: token,
                user: {
                    username: user.username,
                    userID: user._id,
                    createdAt: user.createdAt,
                }
            });
        }
    })
})

// @route POST api/users/
// @desc verify a user
// @access Private
router.post('/login', (req, res) => {
    User.findOne({ username: req.body.username, password: req.body.password }, (err, user) => {
        if (err) res.status(404).json({ error: error })
        else {
            const token = jwt.sign(user.toObject(), JWT_KEY)
            res.json({
                message: "Login Sucess",
                token: token,
                user: {
                    username: user.username,
                    userID: user._id,
                    createdAt: user.createdAt,
                }
            });
        }
    })
})


// @route PUT api/users/id
// @desc Edits a username or password
// @access Private
router.put('/:id', (req, res) => {
    const { authorization } = req.headers
    const [, token] = authorization.split(" ")
    try {
        jwt.verify(token, JWT_KEY)
        const filter = { _id: req.params.id };
        const update = req.body.username ? { username: req.body.username } : { password: req.body.password };
        User.findOneAndUpdate(filter, update, { new: true })
            .then(user => res.json(user))
    } catch (error) {
        res.status(401).json({ error: error });
    }
})

// @route PUT api/users/delete
// @desc deletes a user
// @access Private
router.post('/delete', (req, res) => {
    const { authorization } = req.headers
    const [, token] = authorization.split(" ")
    try {
        jwt.verify(token, JWT_KEY)
        User.findOneAndRemove({ username: req.body.username, password: req.body.password }, (err, user) => {
            err ? res.status(401).json({ error: error }) : res.json({
                message: "Remove Sucess", DeletedUser: user.username
            });
        })
    } catch (error) {
        res.status(401).json({ error: error });
    }
})

module.exports = router;