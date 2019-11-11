const TorreServices = require('../services/torre.services')

const torreServices = new TorreServices();
var control;

/**
 * Call recursive function. Establish firt case, if target bio is find in 
 * degree one connections return it
 * @param {*} usr_from 
 * @param {*} usr_to 
 */
const callBuilder = async (usr_from, usr_to) => {

    control = [usr_from]
    const connections = await torreServices.getConnectionsByUsername({username:usr_from})
    const degreeOne = connections.filter( elem => elem.degrees == 1)

    const _path = await pathFinder(usr_to, degreeOne)
    
    return _path
}

/**
 * Recursive function, DFS implementation,
 * search match by person fisrt level connections
 * @param {*} usr_to 
 * @param {*} degreeOneConnections 
 * @param {*} _path 
 */
const pathFinder = async ( usr_to, degreeOneConnections, _path = [], deep=1) => {

    if( deep === 5){        
        return;
        }

    const targetConnection = degreeOneConnections.find( element => element.person.publicId == usr_to)

        //Base case
        if(targetConnection){
            const person = {
                ...targetConnection.person
            }
            return [..._path,person];
        }

    /**
     * Backtracking
     */
    for(let connection of degreeOneConnections){

        const publicId = connection.person.publicId
           
        //Processed people
        control = [...control,publicId]

        _path = [..._path,connection.person]
                
        const degreeTwoConnections = await torreServices.getConnectionsByUsername({username:publicId})
        
        //Filter first level connection and exclude perosons that have been processed (control)
        let connections = degreeTwoConnections.filter( element => {
            const isDegreeOne = element.degrees == 1
            const markVisited = !control.includes(element.person.publicId)
            
            return isDegreeOne && markVisited;
        })

        //Lookng for a match finding in current person fisrt level connection
        const foundConnection = connections.find( element => element.person.publicId === usr_to)

        if(foundConnection){            
            
            return [..._path,foundConnection.person];
        }
        
        //recursion
        await pathFinder(usr_to,connections, _path,deep++)        
    }
}

module.exports = callBuilder