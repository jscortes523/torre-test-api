const boom = require('@hapi/boom')
const config = require('../../config')

/**
 * Verify current enviroment to send error
 * @param  error 
 * @param  stack 
 */
function withErrorStack(error, stack){
    if(config.dev){
        return {...error, stack}
    }

    return error
}

/**
 * Custom error middleware logger
 */
function logError(err, req, res, next){
    console.log(err)
    next(err)
}

/**
 * Transform error output to Boom error
 */
function wrapError(err, req, res, next){
    if(!err.isBoom){
        next(boom.badImplementation(err))
    }
    next(err)
}

/**
 * Response with Boom error ouput
 */
function errorHandler(err, req,res, next){
    const { 
        output: {statusCode, payload}
    } = err
    res.status(statusCode)
    res.json(withErrorStack(payload,err.stack))
}

module.exports = {
    logError,
    wrapError,
    errorHandler
}