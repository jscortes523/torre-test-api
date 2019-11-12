const boom = require('@hapi/boom')
const joi = require('@hapi/joi')

/**
 * Get input and verify its structur according to schema
 * @param {*} data 
 * @param {*} schema 
 */
function validate(data, schema){
    const joiSchema = joi.object(schema)
    const {error} = joiSchema.validate(data)
    return error
}

/**
 * Validate schema and input request values (body, query, params) according to 
 * defined schema
 * @param {*} schema 
 * @param {*} check 
 */
function validationHandler(schema, check="params"){
    return function(req, res, next){
        const error = validate(req[check],schema)

        error ? next(boom.badRequest(error)): next()
    }
}

module.exports = validationHandler