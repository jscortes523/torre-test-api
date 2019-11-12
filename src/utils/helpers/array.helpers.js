/**
 * Filter fisrt level element
 * Criteria:
 * - Degree must be 1
 * - Must have a weight
 * - username not equal to publicId param
 * @param {String} publicId 
 */
const filteredDegreeTwo = (publicId)  => {
    
    return (element) => {
        const hasWeight = element.person.weight > 0
        const isDegreeOne = element.degrees == 1
        const isCurrent = element.person.publicId === publicId

        return hasWeight && isDegreeOne && !isCurrent
    }    
}

/**
 * Sort by bio weight
 * Descending
 * @param {any} a 
 * @param {any} b 
 */
const compareByWeightDescending = (a, b) => {
    return b.person.weight - a.person.weight
}

/**
 * Transform input for a new output structure
 * @param {any} element 
 */
const getFormattedResponse = (element) => {
    return {
        publicId:element.person.publicId,
        name: element.person.name,
        picture:element.person.picture,
        weight:element.person.weight,
    }
}

module.exports = {
    filteredDegreeTwo,
    compareByWeightDescending,
    getFormattedResponse
}