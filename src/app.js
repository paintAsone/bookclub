import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import { sqlServer } from './db-connect.js'
import { swaggerUi, swaggerSpec } from './swaggerConfig.js'

import * as bookRoutes from './routes/book.route.js'
import * as configRoutes from './routes/config.route.js'

const app = express()
const port = 3333

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// routes
app.use('/books', bookRoutes.router)
app.use('/config', configRoutes.router)


app.listen(port, () => {
    sqlServer.authenticate()
        .then(() => {
            console.log('connected to database')
        })
        .catch((err) => {
            console.log('err', err)
        })
    console.log('Running on port', port)
})