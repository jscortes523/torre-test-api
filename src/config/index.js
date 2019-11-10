require('dotenv').config()

module.exports = config = {
    env:process.env.NODE_ENV,
    dev: process.env.NODE_ENV === 'production' ? false : true,
    port:process.env.PORT || 9090,
    apiUrl:process.env.API_URL,
    redisUrl:process.env.REDIS_URL
}