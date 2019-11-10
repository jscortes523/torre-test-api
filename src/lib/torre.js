const axios = require('axios')
const config = require('../config')

const fetchData = async (_path) => {
    const response = await axios.get(`${config.apiUrl}/${_path}`)
    return response.data
}

module.exports = fetchData