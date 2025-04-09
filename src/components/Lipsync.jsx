// src/components/LipSync.jsx
import React, { useEffect } from 'react'

function LipSync({ timeline }) {
    const [currentPhoneme, setCurrentPhoneme] = React.useState('SLIENCE')

    useEffect(() => {
        if (!timeline) return

        timeline.forEach(({ phoneme, start }) => {
            setTimeout(() => {
                setCurrentPhoneme(phoneme)
            }, start * 1000)
        })

        const last = timeline[timeline.length - 1]
        setTimeout(() => {
            setCurrentPhoneme('SLIENCE')
        }, last.end * 1000)
    }, [timeline])

    return (
        <div>
            {/* 여기서 입모양 상태를 표시할 수 있음 (예: 텍스트로 표시하거나 애니메이션 추가) */}
            <p>현재 입모양: {currentPhoneme}</p>
        </div>
    )
}

export default LipSync
