/*import React, {useState} from 'react'
import mapKoreanToShape from './mapKoreanToShape'
import fetchTTS from "./fetchTTS";
import Hangul from 'hangul-js'

function TextToSpeek(){
    const [setText] = useState('')
    const [currentPhoneme, setCurrentPhoneme] = useState('SLIENCE')
    const [timeline, setTimeline] = useState([])
    // 텍스트를 받아 TTS 발음과 입모양 타이밍을 처리
    function handleTextToSpeech(inputText) {
        // 텍스트 기반으로 입모양 타이밍 계산
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

        // 입모양 타이밍 동기화
        playLipSyncTimeline(flatTimeline)

        // TTS 음성 발음
        fetchTTS(inputText)  // 여기서 직접 호출
    }

    // 입모양 타이밍 동기화
    function playLipSyncTimeline(timeline) {
        timeline.forEach(({ phoneme, start, end }) => {
            setTimeout(() => {
                setCurrentPhoneme(phoneme)
            }, start * 1000)

            setTimeout(() => {
                setCurrentPhoneme('SLIENCE')
            }, end * 1000)
        })
    }


    // 한글 문장을 자모 배열로 분해
    function splitHangulToJamo(text) {
        return text.split('').flatMap(char => Hangul.disassemble(char))
    }

    // 발화 길이 예측 함수 (초 단위)
    function estimateTTSLength(text) {
        return text.length * 0.15
    }

}

export default TextToSpeek*/