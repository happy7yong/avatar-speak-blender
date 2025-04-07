import React, { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Avatar from './components/Avatar'
import { phonemeTimeline } from './phonemeData'

function App() {
    const [currentPhoneme, setCurrentPhoneme] = useState('silence')
    const [started, setStarted] = useState(false)

    const startPlayback = () => {
        const audio = new Audio('/iloveyou.mp3')
        audio.play()
        setStarted(true)

        const timeouts = phonemeTimeline.map(({ phoneme, start }) => {
            return setTimeout(() => {
                setCurrentPhoneme(phoneme)
            }, start * 1000)
        })

        const last = phonemeTimeline[phonemeTimeline.length - 1]
        timeouts.push(setTimeout(() => setCurrentPhoneme('silence'), last.end * 1000))
    }

    return (
        <>
            {!started && (
                <div style={{ position: 'absolute', top: 20, left: 20, zIndex: 10 }}>
                    <button onClick={startPlayback}>🎤 시작하기</button>
                </div>
            )}

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
