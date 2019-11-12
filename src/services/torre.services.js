const fetchData = require('../lib/torre')
const redisCache = require('../lib/cache')

/**
 * Torre services using to call fetch api data,
 * It expose one services by api url.
 * If url had been queried then get data from cache
 */
class TorreServices{
    constructor(){
        this.apiUrl = config.apiUrl
    }

    /**
     * Get Bio by publicId
     * Firsr search in cache
     * @param {Strinf} param0 
     */
    async getBio({username}){
        const _path = `bios/${username}`
        const cache = await redisCache.get(_path)

        if(cache.data){
            return cache.data
        }else{
            const data = await fetchData(_path)
            await redisCache.set(_path,data)            
            return data
        }
    }

    /**
     * Get Connections from publicid, 
     * first search data in cache
     * @param {String} param0 
     */
    async getConnectionsByUsername({username}){
        const _path = `people/${username}/connections`
        const cache = await redisCache.get(_path)

        if(cache.data){
            return cache.data
        }else{            
            const data = await fetchData(_path)
            await redisCache.set(_path,data)
            return data 
        }
    }

    /**
     * Get bios list searching by name
     * Search data in cache
     * @param {String} word 
     * @param {Number} limit
     */
    async searchBios({word, limit}){

        const query = `people?q=${word}&limit=${limit}`
        const cache = await redisCache.get(query)

        if(cache.data){
            return cache.data
        }else{
            const data = await fetchData(query) || []
            await redisCache.set(query,data)   
            return data
        }
    }
}

module.exports = TorreServices