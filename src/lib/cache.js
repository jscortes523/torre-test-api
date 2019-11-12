const config = require('../config')
const redis = require('redis')
/**
 * Heroku redis cache implementation to keep data in memory
 * It help to improve fetchs api perfomance
 * @class RedisCache
 */
class RedisCache{
    constructor(){
        this.redisClient = redis.createClient(config.redisUrl)
    }

    async set(key,value){
        return await this.redisClient.setex(key,3600,JSON.stringify(value),redis.print)
    }

    async get(key){
        var data=[];
        const promise = new Promise( (resolve, reject) =>{
            this.redisClient.get(key,(err, result) =>{
                if(err){
                    reject(err)
                }
                
                if(result){

                    resolve({
                        data:JSON.parse(result)
                    })
                }else{
                    resolve({})
                }
            })
            
        })
        data = await promise
        return data
    }
}

const redisCache = new RedisCache()

module.exports = redisCache