require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const {connect} = require('./config/db')

const app = express()
const port = 3333

const bookRoutes = require('./routes/book')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(cors())

// routes
app.use('/books', bookRoutes.router)


app.listen(port, () => {
    connect()
    .then((connection) => {
        console.log('connected to databse')
    })
    .catch((err) => {
        console.log('err', err)
    })
    console.log('Running on port', port)
})