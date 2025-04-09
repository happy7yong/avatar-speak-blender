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
        SLIENCE: 4,
        silence: 4,
    }

    const [targetInfluences, setTargetInfluences] = useState([0, 0, 0, 0, 0])

    useEffect(() => {
        const newTargets = [0, 0, 0, 0, 0]
        const index = phonemeToIndex[currentPhoneme]
        if (index !== undefined) {
            newTargets[index] = 1
        }
        setTargetInfluences(newTargets)
    }, [currentPhoneme])

    useEffect(() => {
        if (!meshRef.current) return
        console.log('📦 morphTargetDictionary:', meshRef.current.morphTargetDictionary)
    })


    useFrame(() => {
        if (!meshRef.current || !meshRef.current.morphTargetInfluences) return
        const influences = meshRef.current.morphTargetInfluences
        for (let i = 0; i < influences.length; i++) {
            influences[i] += (targetInfluences[i] - influences[i]) * 0.2
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
