import React, { useRef, useEffect } from 'react'
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

    useEffect(() => {
        if (!meshRef.current) return
        const mesh = meshRef.current
        if (!mesh.morphTargetInfluences) return

        // 초기화 후 해당 phoneme만 1로
        mesh.morphTargetInfluences.fill(0)
        const index = phonemeToIndex[currentPhoneme]
        if (index !== undefined) {
            mesh.morphTargetInfluences[index] = 1
        }
    }, [currentPhoneme])

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
