import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Avatar from './components/Avatar'
import Hangul from 'hangul-js'

function App() {
    const [text, setText] = useState('')
    const [currentPhoneme, setCurrentPhoneme] = useState('silence')

    // 말하기 버튼 눌렀을 때 실행
    function handleSpeak(koreanText) {
        // TTS 재생
        const utter = new SpeechSynthesisUtterance(koreanText)
        utter.lang = 'ko-KR'
        speechSynthesis.speak(utter)

        // 한글 자모 분해
        const jamos = splitHangulToJamo(koreanText)
        const durationPerJamo = 0.12

        // 타이밍 정보 생성
        const timeline = jamos.map((j, i) => ({
            phoneme: mapKoreanToShape(j),
            start: i * durationPerJamo,
            end: (i + 1) * durationPerJamo,
        }))

        // 입모양 애니메이션 실행
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
            setCurrentPhoneme('silence')
        }, last.end * 1000)
    }

    // 자모 → 입모양 셰이프 키 매핑
    function mapKoreanToShape(jamo) {
        if ('ㅏㅑㅓㅕ'.includes(jamo)) return 'AA'
        if ('ㅗㅛㅜㅠㅡ'.includes(jamo)) return 'OO'
        if ('ㅣㅐㅔ'.includes(jamo)) return 'EE'
        if ('ㅁㅂㅍ'.includes(jamo)) return 'FV'
        if ('ㄱㅋㅎㄷㄴㄹㅇㅅㅆㅈㅊㅌ'.includes(jamo)) return 'SLIENCE'
        return 'SLIENCE'
    }


    // 한글 문장 → 자모 단위 배열
    function splitHangulToJamo(text) {
        return text.split('').flatMap(char => Hangul.disassemble(char))
    }

    return (
        <>
            <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                <input
                    type="text"
                    placeholder="한글 문장을 입력해보세요"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    style={{ marginRight: '8px', padding: '4px' }}
                />
                <button onClick={() => handleSpeak(text)}>🗣️ 말하기</button>
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
