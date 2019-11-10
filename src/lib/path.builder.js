const TorreServices = require('../services/torre.services')

const torreServices = new TorreServices();

const callBuilder = async (usr_from, usr_to) => {

    let control = [usr_from,'torrenegra']

    const connections = await torreServices.getConnectionsByUsername({username:usr_from})
    const degreeOne = connections.filter( elem => elem.degrees == 1)
    const target = degreeOne.find(elem => elem.person.publicId == usr_to)

    if(target) return [target.person]

    const _path = await pathFinder(control, usr_to, degreeOne)
    
    return _path
}

const pathFinder = async ( control = [], usr_to, degreeOneConnections, _path = []) => {

     /***
      *         const targetConnection = degreeOneConnections.find( element => element.person.publicId == usr_to)

        if(targetConnection){
            const person = {
                ...targetConnection.person
            }
            console.log('directly: ',person.publicId)
            return [..._path,person]
        }

      * case 1: usr_to are in degree one connections
      */

    /**
     * Backtracking
     */
    let connections = []
    for(let connection of degreeOneConnections){

        const publicId = connection.person.publicId
        
        if(publicId == usr_to) return [..._path,connection.person]

        control = [...control,publicId]
        
        console.log(publicId)
        const degreeTwoConnections = await torreServices.getConnectionsByUsername({username:publicId})
        
         connections = degreeTwoConnections.filter( element => {
            const isDegreeOne = element.degrees == 1
            const markVisited = !control.includes(element.person.publicId)
            
            return isDegreeOne && markVisited
        })
        
        
        /*const foundConnection = connections.find( element => element.person.publicId === usr_to)

        if(foundConnection){
            _path = [..._path, foundConnection.person]
            console.log('loop: ',foundConnection.person.publicId)
            return _path
        }*/

        _path = [..._path, connection.person]        
        return await pathFinder(control, usr_to, connections,_path)        
    }
}

module.exports = callBuilder