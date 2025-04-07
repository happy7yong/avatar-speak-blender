import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Avatar({ currentPhoneme }) {
    const { scene } = useGLTF('/avatar.glb')
    const meshRef = useRef()

    const phonemeToIndex = {
        AA: 0,
        OO: 1,
        EE: 2,
        FV: 3,
        silence: 4,
    }

    // 보간을 위해 target 값 저장
    const [targetInfluences, setTargetInfluences] = useState([0, 0, 0, 0, 0])

    useEffect(() => {
        const newTargets = [0, 0, 0, 0, 0]
        const index = phonemeToIndex[currentPhoneme]
        if (index !== undefined) {
            newTargets[index] = 1
        }
        setTargetInfluences(newTargets)
    }, [currentPhoneme])

    useFrame(() => {
        if (!meshRef.current || !meshRef.current.morphTargetInfluences) return
        const influences = meshRef.current.morphTargetInfluences

        // 매 프레임마다 천천히 다가가게 (lerp)
        for (let i = 0; i < influences.length; i++) {
            influences[i] += (targetInfluences[i] - influences[i]) * 0.2 // ← 부드러움 정도 조절
        }
    })

    return (
        <primitive
            object={scene}
            ref={(obj) => {
                if (!obj) return
                obj.traverse((child) => {
                    if (child.isMesh && child.morphTargetInfluences) {
                        meshRef.current = child
                    }
                })
            }}
        />
    )
}
