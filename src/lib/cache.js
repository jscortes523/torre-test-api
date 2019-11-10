const config = require('../config')
const redis = require('redis')

class RedisCache{
    constructor(){
        this.redisClient = redis.createClient(config.redisUrl)
    }

    set(key,value){
        return this.redisClient.set(key,value)
    }

    get(key){
        return this.redisClient.get(key)
    }
}

const redisCache = new RedisCache()

module.exports = redisCache