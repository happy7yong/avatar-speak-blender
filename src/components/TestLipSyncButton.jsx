// src/components/TestLipSyncButton.jsx
import React from 'react'
import Hangul from 'hangul-js'
import mapKoreanToShape from './mapKoreanToShape'

export default function TestLipSyncButton({ setCurrentPhoneme, setTimeline }) {
    const handleTest = async () => {
        try {
            // 1. Whisper 분석 결과 로드
            const res = await fetch('/tts_output.json')
            const segments = await res.json()

            const timeline = []

            segments.forEach(({ text, start, end }) => {
                const jamos = splitHangulToJamo(text)
                const duration = end - start
                const perJamo = duration / jamos.length

                jamos.forEach((j, i) => {
                    const phoneme = mapKoreanToShape(j)
                    timeline.push({
                        phoneme,
                        start: +(start + i * perJamo).toFixed(2),
                        end: +(start + (i + 1) * perJamo).toFixed(2),
                    })
                })
            })

            setTimeline(timeline)

            // 2. mp3 재생
            const audio = new Audio('/tts_output.mp3')
            audio.play()

            // 3. 립싱크 애니메이션 동기화
            playLipSyncTimeline(timeline, setCurrentPhoneme)
        } catch (err) {
            console.error('립싱크 테스트 실패:', err)
        }
    }

    return (
        <button onClick={handleTest} style={{ padding: '8px 16px', marginTop: 10 }}>
            🎤 립싱크 테스트 실행
        </button>
    )
}

function splitHangulToJamo(text) {
    return text.split('').flatMap((char) => Hangul.disassemble(char)).filter(j => j.trim() !== '')
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
