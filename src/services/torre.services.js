const fetchData = require('../lib/torre')
const redisCache = require('../lib/cache')

class TorreServices{
    constructor(){
        this.apiUrl = config.apiUrl
    }

    async getBio({username}){
        const _path = `bios/${username}`
        const data = await fetchData(_path)            
        return data || {}
    }

    async getConnectionsByUsername({username}){
        const _path = `people/${username}/connections`
        const cacheData = await redisCache.get(_path)

        if(cacheData.length > 0){
            return cacheData
        }else{            
            const data = await fetchData(_path)
            await redisCache.set(_path,data)
            return data 
        }
    }

    async searchBios({word, limit}){
        const query = `people?q=${word}&limit=${limit}`
        return await fetchData(query) || []
    }
}

module.exports = TorreServices