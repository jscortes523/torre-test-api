const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const config = require('./config')
const routes = require('./routes')

//Errors
const {
    logError,
    wrapError,
    errorHandler
} = require('./utils/errors/error.handler')

//Express app
const app = express()

//Setting up express
app.use(bodyParser.json())
app.use(cors())
app.disable('x-powered-by');

//variables
const port = config.port

//routes
const router = express.Router()
router.use('/routes', routes)
app.use('/api',router)

//Error middleware
app.use(logError)
app.use(wrapError)
app.use(errorHandler)

app.listen(port, () =>{
    console.log(`Hey Torre, listen something special on http://localhost:${port}`)
})