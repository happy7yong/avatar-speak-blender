// src/Avatar.jsx
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export function Avatar() {
    const { scene} = useGLTF('/avatar.glb')
    const meshRef = useRef()

    useFrame(() => {
        if (meshRef.current) {
            const mesh = meshRef.current
            if (mesh.morphTargetInfluences) {
                mesh.morphTargetInfluences.fill(0)
                mesh.morphTargetInfluences[3] = 1 // AA
            }
        }
    })


    // GLB 안의 얼굴 메시가 어디 있는지 정확히 찾아야 해
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
