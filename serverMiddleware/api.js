const express = require('express')
const bodyParser = require('body-parser')

const authRoutes = require('../api/auth')
const postRoutes = require('../api/posts')

const app = express()

app.use(bodyParser.json())

// Routes
app.use('/auth', authRoutes)
app.use('/posts', postRoutes)

module.exports = app
