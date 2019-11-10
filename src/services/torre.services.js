const fetchData = require('../lib/torre')


class TorreServices{
    constructor(){
        this.apiUrl = config.apiUrl
    }

    async getBio({username}){
        const _path = `bios/${username}`
        const data = await fetchData(_path)            
        return data
    }

    async getConnectionsByUsername({username, word = '', limit = ''}){
        const _path = `people/${username}/connections?q=${word}&limit=${limit}`
        return await fetchData(_path)
    }

    async searchBios({word, limit}){
        const query = `people?q=${word}&limit=${limit}`
        return await fetchData(query)
    }
}

module.exports = TorreServices