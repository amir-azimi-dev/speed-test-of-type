'use strict'
const $ = document

let texts = [
    "The body'strongest muscle is our tongue.",
    "A duck's quack has no echo, and nobody knows why!",
    "Mosquitoes have teeth.",
    "Three things in life that are never certain: Dreams, Success and Fortune.",
    "Three things in life, one go never come back: Time, Words and Opportunity.",
]

const textContainer = $.querySelector("#text-container")
const wpmElem = $.querySelector("#wpm")
const timeElem = $.querySelector("#time")
const accuracyElem = $.querySelector("#accuracy")
const textSection = $.querySelector("#text-section")

let numOfTexts = 2
let spanElems
let currentIndex = 0
let passedSeconds = 0
let typedCharsCount = 0
let mistakes = 0
let flag = []
let timerInterval
let speedInterval
let accuracyInterval

let keySound = new Audio("./assets/key-sound.mp3")
keySound.playbackRate = 16

const generateRandomText = count => {
    let textContent = ''
    let randIndex
    for (let i = 0; i < count; i++) {
        randIndex = Math.floor(Math.random() * texts.length)
        if (i === count - 1) {
            return textContent += (texts[randIndex])
        };
        textContent += (texts[randIndex] + " ")
    }
    return textContent
}

const updateTextContent = () => {
    let newTextContent = generateRandomText(numOfTexts)
    let charsArray = newTextContent.split('')
    let textSpansCode = ''
    for (let char of charsArray) {
        textSpansCode += `<span class='char'>${char}</span>`
    }
    textContainer.insertAdjacentHTML("beforeend", textSpansCode)
    setActivateSpan()
}


const keyPressHandler = event => {
    if (typedCharsCount === spanElems.length - 1) { viewResult() }  // end of the speed test
    let key = event.key

    if (key != 'Backspace' && key != 'Shift' && key != 'CapsLock' && key != "Alt" && key != "Control") {
        setStatus(key)
        typedCharsCount++
    } else if (key === 'Backspace') {
        if (typedCharsCount > 1) {
            typedCharsCount--
        }

        if (!flag[currentIndex] && mistakes > 0) {
            mistakes--
        }
        spanElems[currentIndex].classList.remove("right")
        spanElems[currentIndex].classList.remove("wrong")
        if (currentIndex) {
            spanElems[currentIndex - 1].classList.remove("right")
            spanElems[currentIndex - 1].classList.remove("wrong")
            currentIndex--
        }
        setActivateSpan()
    }

}

const setActivateSpan = () => {
    spanElems = textContainer.querySelectorAll(".char")
    if (currentIndex && currentIndex < spanElems.length - 1) {
        spanElems[currentIndex - 1].classList.remove("active")
        spanElems[currentIndex + 1].classList.remove("active")
    } else if (currentIndex < spanElems.length - 1) {
        spanElems[currentIndex + 1].classList.remove("active")
    }
    if (currentIndex < spanElems.length - 1) {
        spanElems[currentIndex].classList.add("active")
    }
}


const setStatus = key => {           // set wrong or right char typed
    keySound.currentTime = 0;
    keySound.play();
    if (key === spanElems[currentIndex].textContent) { // not innerHtml, also can use innerText
        spanElems[currentIndex++].classList.add("right")
        flag.push(1)

    } else {
        spanElems[currentIndex++].classList.add("wrong")
        mistakes++
        flag.push(0)
    }
    setActivateSpan()
}


const setTimer = (event) => {
    let key = event.key
    let seconds, minutes
    if (key != 'Backspace' && key != 'Shift' && key != 'CapsLock' && key != "Alt" && key != "Control") {
        timerInterval = setInterval(() => {
            passedSeconds++
            minutes = String(Math.floor(passedSeconds / 60)).padStart(2, '0')
            seconds = String(passedSeconds % 60).padStart(2, '0')
            timeElem.innerHTML = `${minutes} : ${seconds}`
            setTimeout(() => {
                speedInterval = setInterval(() => showSpeed(), 100)
                accuracyInterval = setInterval(() => showAccuracy(), 100)
            }, 1);
        }, 1000)

    }
}


const showSpeed = () => {
    let speed = Math.round((typedCharsCount / (5 * passedSeconds)) * 60)
    wpmElem.innerHTML = `speed: ${speed} wps`
}

const showAccuracy = () => {
    let accuracy = Math.round(((typedCharsCount - mistakes) / typedCharsCount) * 100)
    accuracyElem.innerHTML = `accuracy: ${accuracy}%`
}

const viewResult = () => {
    $.body.removeEventListener('keydown', keyPressHandler)
    clearInterval(timerInterval)
    clearInterval(speedInterval)
    clearInterval(accuracyInterval)
    textSection.innerHTML = "<h3 class='text-center text-info fw-bold border border-4 border-light rounded-4 p-3'>your speed test finished. details are visible.</h3>"
}

////////////////////////////////////////////////////////////////////////////////

$.body.addEventListener("keydown", keyPressHandler)
$.body.addEventListener("keypress", event => setTimer(event), { once: true })

onload = updateTextContent()