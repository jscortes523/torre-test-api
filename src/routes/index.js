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
    parameterSchema
} = require('../utils/schemas/request.schema')

const router = express.Router()

const torreServices = new TorreServices()

router.get('/bio/:username', validationHandler(parameterSchema),getBio)
      .get('/heavy/people/:username', validationHandler(parameterSchema), getTopRecommendations)
      .get('/connections', getConnectionsOf)
      .get('/path/to', getPathTo)
      .get('/search',searchByName)

/**
 * username param require
 * /heavy/people/userExample
 */      
async function getTopRecommendations(req, res, next){
    
    try {         
        const { username } = req.params

        const allConnections = await torreServices.getConnectionsByUsername({username})
        const promises = allConnections.filter(element => element.degrees == 1)
            .map( async element => {
                const publicId = element.person.publicId
                const degreeTwoConnections = await torreServices.getConnectionsByUsername({username:publicId})

                /**
                 * Step 1: Get first level connection using helper criteria
                 * Step 2: Descending Sort by weight 
                 * Step 3: transform output array elements
                 * Steo 5: Get only top 5 element
                 */
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

/**
 * Query param is require
 * {/connection?username=usrExample} 
 */
async function getConnectionsOf(req, res, next){
    try {
        
        const {username} = req.query
        let connections = await torreServices.getConnectionsByUsername({username})

        /**
         * Step 1: Get first level connections
         * Step 2: transform ouput array
         * Step 3: Sort array elements by weight, descending
         * Step 4: Get only the top 5
         */
        connections = connections.filter( elem => elem.degrees === 1)
                        .map( item => {
                           return { 
                                username: item.person.publicId,
                                picture: item.person.picture,
                                weight: item.person.weight
                            }
                        }).sort( (a,b) => b.weight - a.weight)
                        .slice(0,10)
        const current = await torreServices.getBio({username})

        res.status(200).json({
            current:{
                username:username,
                picture:current.person.picture
            },
            data: connections
        })


    } catch (error) {
        next(error)
    }
}

/**
 * Get path from current user to user target
 * Body require
 * {
 *      usr_from: current_publicid
 *      usr_to: target_publicid
 * }
*/
async function getPathTo(req, res, next){
    try {
        const { usr_from, usr_to } = req.body        
        const _path = await callBuilder(usr_from, usr_to)

        res.status(200).json(_path)

    } catch (error) {
        next(error)
    }

}

/**
 * Search bios by name
 * Query param require
 * /search?q=name of user&limit=100
 * If limit is undefined then It retreive 100 records
 */
async function searchByName(req,res, next){
    try {
        const { word, limit } = req.query
        let query = {}
        
        //Verify if one or both of query params come

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

/**
 * Get one bio record by its username/publicId
 * param require
 * {/bio/exampleUser}
 */
async function getBio (req, res, next){
    const { username } = req.params
    const bio = await torreServices.getBio({username})

    res.status(200).json(bio)
}

module.exports = router