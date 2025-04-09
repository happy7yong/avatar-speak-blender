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
    const [currentPhoneme, setCurrentPhoneme] = useState('SLIENCE')
    const [timeline, setTimeline] = useState([])

    // 말하기 버튼을 눌렀을 때 실행
    function handleSpeak() {
        if (!text.trim()) {
            console.log('텍스트가 비어있습니다. 입력 후 버튼을 클릭해주세요.')
            return
        }

        // TTS 음성 발음 및 입모양 동기화
        handleTextToSpeech(text)
    }

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

    // TTS 발음 처리
    async function fetchTTS(text) {
        const API_KEY = 'AIzaSyC5MCrRINOvp2nmDN7mDLOr_woIZMASqFM'
        const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`

        const body = JSON.stringify({
            input: { text: text },
            voice: { languageCode: 'ko-KR', name: 'ko-KR-Wavenet-A' },
            audioConfig: { audioEncoding: 'MP3' },
        })

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: body,
        })

        const data = await response.json()

        if (data.error) {
            console.error('TTS API 에러:', data.error)
            return
        }

        const audioContent = data.audioContent
        const audio = new Audio('data:audio/mp3;base64,' + audioContent)
        audio.play()
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
                <button onClick={handleSpeak}>🗣️ 말하기</button>
            </div>

            {/* TextToSpeech와 LipSync 컴포넌트 */}
            <TextToSpeech text={text} onEnd={() => console.log('TTS 완료')} />
            <Canvas camera={{ position: [0, 1.5, 3] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <OrbitControls />
                <Avatar currentPhoneme={currentPhoneme} />
            </Canvas>

            <LipSync timeline={timeline} />
        </>
    )
}

export default App
