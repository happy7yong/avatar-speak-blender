// src/components/LipSync.jsx
import React, { useEffect } from 'react'

function LipSync({ timeline }) {
    const [currentPhoneme, setCurrentPhoneme] = React.useState('SLIENCE')

    useEffect(() => {
        if (!timeline || timeline.length === 0) return

        timeline.forEach(({ phoneme, start, end }) => {
            if (!phoneme || typeof start !== 'number' || typeof end !== 'number') return

            setTimeout(() => {
                setCurrentPhoneme(phoneme)
            }, start * 1000)

            setTimeout(() => {
                setCurrentPhoneme('SLIENCE')
            }, end * 1000)
        })
    }, [timeline])

    return (
        <div>
            <p>현재 입모양: {currentPhoneme}</p>
        </div>
    )
}

export default LipSync
