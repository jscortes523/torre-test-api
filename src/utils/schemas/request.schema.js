const joi = require('@hapi/joi')

const parameterSchema = {
    username: joi.string().max(100).required()
}

const querySchema = {
    q:joi.string().max(50),
    limit:joi.number().max(100)
}

const bodyFindPathSchema = {
    usr_to: joi.string().max(100).required(),
    usr_from:joi.string().max(100).required()
}

module.exports = {
    parameterSchema,
    querySchema,
    bodyFindPathSchema
}