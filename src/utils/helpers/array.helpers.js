const filteredDegreeTwo = (publicId)  => {
    
    return (element) => {
        const hasWeight = element.person.weight > 0
        const isDegreeOne = element.degrees == 1
        const isCurrent = element.person.publicId === publicId

        return hasWeight && isDegreeOne && !isCurrent
    }    
}

const compareByWeightDescending = (a, b) => {
    return b.person.weight - a.person.weight
}

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