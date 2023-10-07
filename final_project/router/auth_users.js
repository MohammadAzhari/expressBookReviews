const express = require('express')
const jwt = require('jsonwebtoken')
let books = require('./booksdb.js')
const regd_users = express.Router()

let users = []

//only registered users can login
regd_users.post('/login', (req, res) => {
    //Write your code here
    let { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send('username and password not provided')
    }
    let user = users.find((user) => user.username === username)
    if (!user || user.password !== password) {
        return res.status(400).send('the password or username is wrong')
    }
    let accessToken = jwt.sign(user, 'a')

    req.session.accessToken = accessToken

    res.send(accessToken)
})

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
    //Write your code here
    let review = req.query.review
    let username = req.session.username
    let isbn = req.params.isbn

    books[isbn].reviews[username] = review

    res.send(books[isbn].reviews)
})

regd_users.delete('/auth/review/:isbn', (req, res) => {
    //Write your code here
    let username = req.session.username
    let isbn = req.params.isbn

    let reviews = books[isbn].reviews
    delete reviews[username]

    res.send(books[isbn].reviews)
})

module.exports.authenticated = regd_users
module.exports.users = users
