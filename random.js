var ALL_CHAR_PROPS = [
    ['E', 11.1607],
    ['A', 8.4966],
    ['R', 7.5809],
    ['I', 7.5448],
    ['O', 7.1635],
    ['T', 6.9509],
    ['N', 6.6544],
    ['S', 5.7351],
    ['L', 5.4893],
    ['C', 4.5388],
    ['U', 3.6308],
    ['D', 3.3844],
    ['P', 3.1671],
    ['M', 3.0129],
    ['H', 3.0034],
    ['G', 2.4705],
    ['B', 2.0720],
    ['F', 1.8121],
    ['Y', 1.7779],
    ['W', 1.2899],
    ['K', 1.1016],
    ['V', 1.0074],
    ['X', 0.2902],
    ['Z', 0.2722],
    ['J', 0.1965],
    ['Q', 0.1962],]

var random = new Math.seedrandom('seed');

function randomFromWeight(weights) {
    const sumWeight = weights.reduce((sum, w) => sum + w, 0)
    const randomPoint = random() * sumWeight
    let accWeight = 0
    for (let index = 0; index < weights.length; index++) {
        accWeight += weights[index]
        if (accWeight > randomPoint) return index
    }

    return 0
}

function buildCounMap(arr) {
    let result = {}
    for (let key of arr) {
        if (!result.hasOwnProperty(key)) result[key] = 0
        result[key] += 1
    }
    return result
}

function randomCharArray(initArray, limit, amount) {
    const countMap = buildCounMap(initArray)
    let charProps = ALL_CHAR_PROPS.filter(([char, prop]) => (countMap[char] || 0) < limit)
    let result = []
    for (let index = 0; index < amount; index++) {
        const weights = charProps.map(([_, w]) => w)
        const randomIndex = randomFromWeight(weights)
        const randChar = charProps[randomIndex][0]
        result.push(randChar)
        countMap[randChar] = countMap.hasOwnProperty(randChar) ? countMap[randChar] + 1 : 1
        charProps = ALL_CHAR_PROPS.filter(([char, prop]) => (countMap[char] || 0) < limit)
    }
    return result
}