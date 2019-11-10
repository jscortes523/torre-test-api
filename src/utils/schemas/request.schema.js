const joi = require('@hapi/joi')

const parameterSchema = {
    username: joi.string().max(100).required()
}

const querySchema = {
    q:joi.string().max(50),
    limit:joi.number().max(100)
}

module.exports = {
    parameterSchema,
    querySchema
}