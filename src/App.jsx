// src/App.jsx
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Avatar from './components/Avatar'
import TextToSpeech from './components/TextToSpeech'
import LipSync from './components/LipSync'
import Hangul from 'hangul-js'

function App() {
    const [text, setText] = useState('')
    const [timeline, setTimeline] = useState([])

    // TTS가 끝났을 때 입모양 애니메이션 타이밍 생성
    function handleEndOfSpeech() {
        const words = text.trim().split(' ')

        const wordTimeline = words.map((word) => {
            const jamos = splitHangulToJamo(word)
            const durationPerJamo = estimateTTSLength(word) / jamos.length

            return jamos.map((j, i) => ({
                phoneme: mapKoreanToShape(j),
                start: i * durationPerJamo,
                end: (i + 1) * durationPerJamo,
            }))
        })

        setTimeline(wordTimeline.flat()) // flat()으로 한 단어 단위로 펼침
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
                <button onClick={() => handleEndOfSpeech()}>🗣️ 말하기</button>
            </div>

            <TextToSpeech text={text} onEnd={handleEndOfSpeech} />

            <Canvas camera={{ position: [0, 1.5, 3] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <OrbitControls />
                <Avatar currentPhoneme={timeline[timeline.length - 1]?.phoneme || 'SLIENCE'} />
            </Canvas>

            {/* 입모양 애니메이션을 별도 컴포넌트로 분리 */}
            <LipSync timeline={timeline} />
        </>
    )
}

export default App
