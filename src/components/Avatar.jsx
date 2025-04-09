import React, { useRef, useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'

export default function Avatar({ currentPhoneme }) {
    const { scene } = useGLTF('/avatar.glb')
    const meshRef = useRef()

    // 각 음성에 대한 morphTarget 인덱스 매핑
    const phonemeToIndex = {
        AA: 0,
        OO: 1,
        EE: 2,
        FV: 3,
        SLIENCE: 4,
        silence: 4,
    }

    // 기본 영향도를 [0, 0, 0, 0, 0]으로 설정
    const [targetInfluences, setTargetInfluences] = useState([0, 0, 0, 0, 0])

    // currentPhoneme이 변경될 때마다 targetInfluences 갱신
    useEffect(() => {
        const newTargets = [0, 0, 0, 0, 0]  // 초기화
        const index = phonemeToIndex[currentPhoneme]

        if (index !== undefined) {
            newTargets[index] = 1  // currentPhoneme에 해당하는 index의 영향도를 1로 설정
        }

        setTargetInfluences(newTargets)
    }, [currentPhoneme])

    // 매 프레임마다 morphTargetInfluences에 목표 영향을 점진적으로 적용
    useFrame(() => {
        if (!meshRef.current || !meshRef.current.morphTargetInfluences) return

        const influences = meshRef.current.morphTargetInfluences
        for (let i = 0; i < influences.length; i++) {
            // 타겟 영향을 현재 영향도와 부드럽게 선형 보간
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
