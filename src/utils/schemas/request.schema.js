const joi = require('@hapi/joi')

//Schema to validate input request params
const parameterSchema = {
    username: joi.string().max(100).required()
}

//Schema to validate input request query
const querySchema = {
    q:joi.string().max(50),
    limit:joi.number().max(100)
}

//Schema to validate input request body to Search by username service
const bodyFindPathSchema = {
    usr_to: joi.string().max(100).required(),
    usr_from:joi.string().max(100).required()
}

module.exports = {
    parameterSchema,
    querySchema,
    bodyFindPathSchema
}