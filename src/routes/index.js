const express = require('express')
const validationHandler = require('../utils/middlewares/validation.handler')
const TorreServices = require('../services/torre.services')
const callBuilder = require('../lib/path.builder')

const {
    filteredDegreeTwo,
    compareByWeightDescending,
    getFormattedResponse
} = require('../utils/helpers/array.helpers')

const {
    parameterSchema,
    bodyFindPathSchema
} = require('../utils/schemas/request.schema')

const router = express.Router()

const torreServices = new TorreServices()

router.get('/bio/:username', validationHandler(parameterSchema),getBio)
      .get('/powerup/:username', validationHandler(parameterSchema), getTopSuggestions)
      .get('/path/to',validationHandler(bodyFindPathSchema, 'body'), getPathTo)
      .get('/search',searchByName)

async function getTopSuggestions(req, res, next){
    
    try {         
        const { username } = req.params

        const allConnections = await torreServices.getConnectionsByUsername({username})
        const promises = allConnections.filter(element => element.degrees == 1)
            .map( async element => {
                const publicId = element.person.publicId
                const degreeTwoConnections = await torreServices.getConnectionsByUsername({username:publicId})

                const processedConnections = degreeTwoConnections.filter( filteredDegreeTwo(publicId) )
                                            .sort( compareByWeightDescending )
                                            .map( getFormattedResponse )
                                            .slice(0,5)
                return {
                    publicId:publicId,
                    name: element.person.name,
                    picture:element.person.picture,
                    weight:element.person.weight,
                    topConnections: processedConnections
                }
            }
        )

        let connections = await Promise.all(promises)

        connections = connections.sort( (a,b) => b.weight - a.weight)
        res.status(200).json(connections)

    } catch (error) {
        next(error)
    }
}

async function getPathTo(req, res, next){
    try {
        const { usr_from, usr_to } = req.body        
        const _path = await callBuilder(usr_from, usr_to)

        res.status(200).json(_path)

    } catch (error) {
        next(error)
    }

}

async function searchByName(req,res, next){
    try {
        const { word, limit } = req.query
        let query = {}
        
        if(!word){
            query = {
                ...query,
                word:""
            }
        }else{
            query = {
                ...query,
                word
            }
        }

        if(!limit){
            query = {
                ...query,
                limit:""
            }
        }else{
            query={
                ...query,
                limit
            }
        }console.log('query',query)
        const result = await torreServices.searchBios({word:query.word, limit:query.limit})

        res.status(200).json(result)

    } catch (error) {
        next(error)
    }
}

async function getBio (req, res, next){
    const { username } = req.params
    const bio = await torreServices.getBio({username})

    res.status(200).json(bio)
}

module.exports = router