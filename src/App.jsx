// src/App.jsx
import React, { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Avatar from './components/Avatar'
import LipSync from './components/LipSync'
import { handleTextToSpeech } from './utils/TextToSpeechUtils'
import TestLipSyncButton from "./components/TestLipSyncButton";

function App() {
    const [text, setText] = useState('')
    const [currentPhoneme, setCurrentPhoneme] = useState('SLIENCE')
    const [timeline, setTimeline] = useState([])

    //말하기 버튼을 눌렀을때
    function handleSpeak() {
        if (!text.trim()) {
            console.log('텍스트가 비어있습니다. 입력 후 버튼을 클릭해주세요.')
            return
        }

        //TTS 음성 발음 및 입모양 동기화
        handleTextToSpeech(text, setCurrentPhoneme, setTimeline)
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


            <Canvas camera={{ position: [0, 1.5, 3] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[2, 2, 2]} />
                <OrbitControls />
                <Avatar currentPhoneme={currentPhoneme} />
            </Canvas>
            <TestLipSyncButton
                setCurrentPhoneme={setCurrentPhoneme}
                setTimeline={setTimeline}
            />

            <LipSync timeline={timeline} />

        </>
    )
}

export default App
