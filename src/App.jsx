import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Avatar from './components/Avatar'
import Hangul from 'hangul-js'

function App() {
    const [text, setText] = useState('')
    const [currentPhoneme, setCurrentPhoneme] = useState('SLIENCE')

    // 사용자가 말하기 버튼을 눌렀을 때 실행
    function handleSpeakSentence(fullText) {
        const words = fullText.trim().split(' ')
        let totalDelay = 0

        words.forEach((word, index) => {
            const delay = totalDelay * 1000

            setTimeout(() => {
                speakWord(word)
            }, delay)

            const estimatedDuration = estimateTTSLength(word)
            totalDelay += estimatedDuration + 0.3 // 단어 끝나고 0.3초 쉬기
        })
    }

    // 단어 하나를 TTS + 입모양 처리
    function speakWord(word) {
        const utter = new SpeechSynthesisUtterance(word)
        utter.lang = 'ko-KR'
        speechSynthesis.speak(utter)

        const jamos = splitHangulToJamo(word)
        const durationPerJamo = estimateTTSLength(word) / jamos.length

        const timeline = jamos.map((j, i) => ({
            phoneme: mapKoreanToShape(j),
            start: i * durationPerJamo,
            end: (i + 1) * durationPerJamo,
        }))

        playLipSyncTimeline(timeline)
    }

    // 입모양 애니메이션 재생
    function playLipSyncTimeline(timeline) {
        timeline.forEach(({ phoneme, start }) => {
            setTimeout(() => {
                setCurrentPhoneme(phoneme)
            }, start * 1000)
        })

        const last = timeline[timeline.length - 1]
        setTimeout(() => {
            setCurrentPhoneme('SLIENCE')
        }, last.end * 1000)
    }

    // 한글 자모 → 입모양 이름 매핑
    function mapKoreanToShape(jamo) {
        if ('ㅏㅑㅓㅕ'.includes(jamo)) return 'AA'
        if ('ㅗㅛㅜㅠㅡ'.includes(jamo)) return 'OO'
        if ('ㅣㅐㅔ'.includes(jamo)) return 'EE'
        if ('ㅁㅂㅍ'.includes(jamo)) return 'FV'
        if ('ㄱㅋㅎㄷㄴㄹㅇㅅㅆㅈㅊㅌ'.includes(jamo)) return 'SLIENCE'
        return 'SLIENCE'
    }

    // 한글 문장을 자모 배열로 분해
    function splitHangulToJamo(text) {
        return text.split('').flatMap(char => Hangul.disassemble(char))
    }

    // 발화 길이 예측 함수 (초 단위)
    function estimateTTSLength(text) {
        return text.length * 0.15
    }

    return (
        <>
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <input
                    type="text"
                    placeholder="한글 문장을 입력하세요"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ marginRight: '8px', padding: '4px' }}
                />
                <button onClick={() => handleSpeakSentence(text)}>🗣️ 말하기</button>
            </div>

            <Canvas camera={{ position: [0, 1.5, 3] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <OrbitControls />
                <Avatar currentPhoneme={currentPhoneme} />
            </Canvas>
        </>
    )
}

export default App
