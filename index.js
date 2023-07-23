
// word orderer
const cardTypeColor = {
    enhancement: "green",
    protection: "blue",
    curse: "red"
}
const cardsInfo = [
    { name: "reverse", type: "enhancement", desc: "reverse curse" },
    { name: "de-spell", type: "protection", desc: "de-spell" },
    { name: "debuff de-spell", type: "curse", desc: "can’t de-spell" },
    { name: "lock charactor", type: "curse", desc: "reduce character slot (maximum: 6 chars)" },
    { name: "reduce score", type: "curse", desc: "-20% score (5% - 25% random range)" },
]

var currentRandomChar = getRandomCharArray(4 * 4)
var currentSelectChar = []
var lockChar = []
var submitWord = []
var cards = []
var score = 0

var previewCardIndex = null
var rlock = 0


function randomChar() {
    const charProps = [
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
    const random = Math.random() * 100
    let acc = 0
    for (let index = 0; index < charProps.length; index++) {
        const [char, props] = charProps[index];
        acc += props
        if (acc >= random) {
            return char
        }
    }

    return 'E'
}

function renderWord() {
    const wordOrdererElem = document.getElementById("word-orderer")
    let html = `<h1>Broom-racing</h1>`

    // cards panel
    let cardHtml = `<div id="word-orderer-card-panel">`
    for (let index = 0; index < cards.length; index++) {
        const card = cards[index];
        const info = cardsInfo[card.index]
        const isUsed = card.isUsed
        cardHtml += `
        <div style="padding: 5px;">
            <div onclick="onPreviewCard(${index})" style="border-style: solid; padding: 5px; color: ${isUsed ? "gray" : "black"}; border-color: ${isUsed ? "gray" : cardTypeColor[info.type]}; border-width: 4px;">
                ${info.name}
            </div>
        </div>`
    }
    cardHtml += `</div>`

    // panel
    let panelHtml = `<div id="word-main-panel">`
    if (previewCardIndex !== null) {
        panelHtml += getPreviewCardHTML(previewCardIndex)
    } else {
        panelHtml += `<div id="word-orderer-panel">`
        for (let index = 0; index < currentRandomChar.length; index++) {
            const char = currentRandomChar[index];
            panelHtml += `<div onclick="onSelectChar(${index})" ${currentSelectChar.includes(index) ? `style="background-color: pink"` :
                lockChar.includes(index) ? `style="background-color: black"` : ""
                }>` + char + "</div>"

        }
        panelHtml += `</div>`
    }
    panelHtml += "</div>"

    // submit word panel
    let submitWordPanel = `<div id="word-orderer-submit-word-panel">`
    submitWordPanel += `<div id="word-orderer-score-board">
    SCORE: ${score}
    </div>`
    submitWordPanel += "<br/>"
    for (let index = 0; index < submitWord.length; index++) {
        const word = submitWord[index];
        submitWordPanel += `<div style="margin: 5px 0px;">${word}</div>`
    }
    submitWordPanel += "</div>"

    html += `<div id="word-orderer-panel-layout">`
    html += cardHtml
    html += panelHtml
    html += submitWordPanel
    html += "</div>"
    // preview
    let preview = `<div id="word-orderer-preview">${currentSelectChar.map(value => currentRandomChar[value]).join("")}</div>`
    html += preview

    // button group
    html += `<div id="word-orderer-button-group">`
    html += `<button onclick="onSave()">Save</button>`
    html += `<button onclick="onClear()">Clear</button>`
    html += `<button onclick="onReset()">Next turn</button>`
    html += `</div>`
    wordOrdererElem.innerHTML = html
    updateGameStateEditor()
}

function getPreviewCardHTML(index) {
    const card = cards[index]
    const info = cardsInfo[card.index]
    let html = `<div id="word-card-preview-panel">`
    html += `<h1>${info.name}</h1>`
    html += `<p>type: <span style="color: ${cardTypeColor[info.type]};">${info.type}</span></p>`
    html += `<p>description: ${info.desc}</p>`
    if (!card.isUsed) {
        html += `<button onclick="onUseCard(${index})" style="margin-right: 10px;">use</button>`
    }
    html += `<button onclick="onCloseCardPreview()" >close</button>`
    html += `</div>`
    return html
}

function onSelectChar(word) {
    if (lockChar.includes(word)) return
    if (currentSelectChar.includes(word)) {
        currentSelectChar = currentSelectChar.filter(value => value !== word)
    } else {
        if (currentSelectChar.length === 7) return
        currentSelectChar.push(word)
    }
    renderWord()
}

function onClear() {
    currentSelectChar = []
    renderWord()
}

function onSave() {
    if (currentSelectChar.length === 0) return
    const word = currentSelectChar.map(value => currentRandomChar[value]).join("")
    submitWord.push(word)

    const substitute = getRandomCharArray(currentSelectChar.length)
    for (let index = 0; index < substitute.length; index++) {
        const substituteValue = substitute[index]
        currentRandomChar[currentSelectChar[index]] = substituteValue
    }
    lockChar = [...lockChar]
    currentSelectChar = []
    updateScoreFromWord(word)
    randomCard(word)
    renderWord()
}

function updateScoreFromWord(word) {
    if (word.length <= 4) {
        score += word.length
        return
    }

    if (word.length <= 7) {
        score += word.length * 1.25
        return
    }

    score += word.length * 2
}

function getRandomCharArray(size) {
    const randomCharArray = Array(size).fill(1).map(() => randomChar())
    let checkMap = {}
    let result = []
    for (let index = 0; index < randomCharArray.length; index++) {
        const char = randomCharArray[index];
        if (!checkMap.hasOwnProperty(char)) checkMap[char] = 0
        if (checkMap[char] < 2) {
            checkMap[char] += 1
            result.push(char)
        } else {
            while (true) {
                const newChar = randomChar()
                if (checkMap[newChar] < 2) {
                    checkMap[newChar] += 1
                    result.push(newChar)
                    break
                }
            }
        }


    }
    return result
}

function onReset() {
    currentRandomChar = getRandomCharArray(4 * 4)
    currentSelectChar = []
    lockChar = []
    renderWord()
}

function randomCard(word) {
    if (word.length <= 4) return
    const card = Math.floor(Math.random() * cardsInfo.length)
    cards.push({ index: card, isUsed: false })
}

function onUseCard(index) {
    cards[index].isUsed = true
    cards = cards.sort((a, b) => (a.isUsed ? 1 : 0) - (b.isUsed ? 1 : 0))
    previewCardIndex = null
    renderWord()
}

function onCloseCardPreview() {
    previewCardIndex = null
    renderWord()
}

function onPreviewCard(index) {
    previewCardIndex = index
    renderWord()
}

function updateGameStateEditor() {
    // var lockChar = []
    document.getElementById("score-editor").value = score
    document.getElementById("lock-editor").value = JSON.stringify(lockChar)
    document.getElementById("rlock-editor").value = rlock


}

function onSubmitScoreEdit() {
    const newScore = Number(document.getElementById("score-editor").value)
    if (isNaN(newScore)) return
    score = newScore
    renderWord()
}

function onSubmitLockEdit() {
    const newLock = JSON.parse(document.getElementById("lock-editor").value)
    lockChar = newLock
    renderWord()
}

function onSubmitRlock() {
    const newRlock = Number(document.getElementById("rlock-editor").value)
    if (isNaN(rlock)) return
    rlock = newRlock
    randomLock()
    renderWord()
}

function randomLock() {
    let slot = Array(4 * 4).fill(1).map((_, index) => index)
    let newLockChar = []

    for (let index = 0; index < lockChar.length; index++) {
        const char = lockChar[index];
        slot = slot.filter(value => value !== char)
        newLockChar.push(char)
    }

    for (let index = 0; index < rlock; index++) {
        let remvoveIndex = slot[Math.floor(slot.length * Math.random())]
        slot = slot.filter(value => value !== remvoveIndex)
        newLockChar.push(remvoveIndex)
    }

    lockChar = newLockChar
}

renderWord()