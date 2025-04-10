// utils/textToSpeechUtils.js
import React from 'react'
import mapKoreanToShape from '../components/mapKoreanToShape'
import fetchTTS from '../components/fetchTTS'
import Hangul from 'hangul-js'

export function handleTextToSpeech(inputText, setCurrentPhoneme, setTimeline) {
    const words = inputText.trim().split(' ')

    const wordTimeline = words.map((word) => {
        const jamos = splitHangulToJamo(word)
        const durationPerJamo = estimateTTSLength(word) / jamos.length

        return jamos.map((j, i) => ({
            phoneme: mapKoreanToShape(j),
            start: i * durationPerJamo,
            end: (i + 1) * durationPerJamo,
        }))
    })

    const flatTimeline = wordTimeline.flat()
    setTimeline(flatTimeline)

    playLipSyncTimeline(flatTimeline, setCurrentPhoneme)
    fetchTTS(inputText, true) //TTS speeking
}

function splitHangulToJamo(text) {
    return text.split('').flatMap(char => Hangul.disassemble(char))
}

function estimateTTSLength(text) {
    return text.length * 0.15
}

function playLipSyncTimeline(timeline, setCurrentPhoneme) {
    timeline.forEach(({ phoneme, start, end }) => {
        setTimeout(() => {
            setCurrentPhoneme(phoneme)
        }, start * 1000)

        setTimeout(() => {
            setCurrentPhoneme('SLIENCE')
        }, end * 1000)
    })
}
