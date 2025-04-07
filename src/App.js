// src/App.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Avatar } from './Avatar'

function App() {
  return (
      <Canvas camera={{ position: [0, 1.5, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[2, 2, 2]} />
        <OrbitControls />
        <Avatar />
      </Canvas>
  )
}

export default App
