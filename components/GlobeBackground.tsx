'use client'

import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { QuadraticBezierLine, Stars } from '@react-three/drei'
import * as THREE from 'three'

function Globe() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 48, 48]} />
      <meshBasicMaterial
        color="#3B6B9A"
        wireframe
        transparent
        opacity={0.35}
      />
    </mesh>
  )
}

function Atmosphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2.15, 48, 48]} />
      <meshBasicMaterial
        color="#4A8BC2"
        side={THREE.BackSide}
        transparent
        opacity={0.12}
      />
    </mesh>
  )
}

function FlightArc() {
  const toSphere = (lat: number, lon: number, r: number): [number, number, number] => {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lon + 180) * (Math.PI / 180)
    return [
      -(r * Math.sin(phi) * Math.cos(theta)),
      r * Math.cos(phi),
      r * Math.sin(phi) * Math.sin(theta),
    ]
  }

  // LHR (51.47, -0.46) to JFK (40.64, -73.78)
  const start = useMemo(() => new THREE.Vector3(...toSphere(51.47, -0.46, 2)), [])
  const end = useMemo(() => new THREE.Vector3(...toSphere(40.64, -73.78, 2)), [])
  const mid = useMemo(() => {
    const m = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    m.normalize().multiplyScalar(3.4)
    return m
  }, [start, end])

  return (
    <QuadraticBezierLine
      start={start}
      end={end}
      mid={mid}
      color="#D4603E"
      lineWidth={2}
      dashed
      dashScale={6}
      dashSize={0.5}
      dashOffset={0}
    />
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <Globe />
      <Atmosphere />
      <FlightArc />
      <Stars
        radius={80}
        depth={60}
        count={500}
        factor={2.5}
        saturation={0}
        fade
        speed={0.3}
      />
    </>
  )
}

export default function GlobeBackground() {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
