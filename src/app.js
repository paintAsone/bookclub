require('dotenv').config()
import * as bookRoutes from './routes/book.route.js'
import * as configRoutes from './routes/config.route.js'

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const { connect } = require('./config/db')

const app = express()
const port = 3333

const { swaggerUi, swaggerSpec } = require('./swaggerConfig.js')
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// routes
app.use('/books', bookRoutes.router)
app.use('/config', configRoutes.router)


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