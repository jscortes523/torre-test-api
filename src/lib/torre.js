const axios = require('axios')
const config = require('../config')

/**
 * Fetch data from torre api accordin to path received
 * @param {String} _path 
 */
const fetchData = async (_path) => {
    const response = await axios.get(`${config.apiUrl}/${_path}`)
    return response.data
}

module.exports = fetchData