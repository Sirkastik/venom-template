const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const path = require('path')

const users = require('./routes/api/users')

const app = express();

// JSON parser and cors
app.use(cors());
app.use(express.json());

// DB Config
const dbURI = require('./config/keys').mongoURI;

// connect to MongoDB
mongoose.connect(dbURI)
    .then(() => console.log('MongoDB connected...'))
    .catch(err => console.log(err));

// use routes
app.use('/api/users', users)

// handle production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('public'))
    // this * route is to serve project on different page routes except root `/`
    app.get(/.*/, (req, res) => {
        res.sendFile(path.resolve(__dirname, 'public', 'index.html'))
    })
}

const port = process.env.PORT || 5000

app.listen(port, () => console.log(`Server started on port ${port}`))