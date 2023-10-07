const express = require('express')
let books = Promise.resolve(require('./booksdb.js'))
let users = require('./auth_users.js').users
const public_users = express.Router()

public_users.post('/register', (req, res) => {
    //Write your code here
    let { username, password } = req.body
    if (!username || !password) {
        return res.status(400).send('username and password not provided')
    }
    if (users.find((user) => user.username === username)) {
        return res.status(400).send('this user is already exist')
    }
    users.push({
        username,
        password,
    })
    res.sendStatus(201)
})

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
    //Write your code here
    res.send(JSON.stringify(await books))
})

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    let book = (await books)[isbn]
    res.send(book)
})

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
    //Write your code here
    let author = req.params.author
    let book

    for (let isbn in await books) {
        if (books[isbn].author === author) {
            book = books[isbn]
        }
    }

    res.send(book)
})

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
    //Write your code here
    let title = req.params.title
    let booksOfTitle = []

    for (let isbn in await books) {
        if (books[isbn].title.startsWith(title)) {
            booksOfTitle.push(books[isbn])
        }
    }

    res.send(booksOfTitle)
})

//  Get book review
public_users.get('/review/:isbn', async function (req, res) {
    //Write your code here
    let isbn = req.params.isbn
    let book = (await books)[isbn]
    res.send(book.reviews)
})

module.exports.general = public_users
