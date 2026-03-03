'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { QuadraticBezierLine, Stars, OrbitControls, Html } from '@react-three/drei'
import * as THREE from 'three'

// ── Airport coordinates ──────────────────────────────────────────────
const AIRPORTS: Record<string, [number, number]> = {
  JFK: [40.64, -73.78], LAX: [33.94, -118.41], ORD: [41.97, -87.91],
  ATL: [33.64, -84.43], DFW: [32.90, -97.04], SFO: [37.62, -122.38],
  MIA: [25.79, -80.29], SEA: [47.45, -122.31], BOS: [42.37, -71.02],
  YYZ: [43.68, -79.63], YVR: [49.19, -123.18], MEX: [19.44, -99.07],
  EWR: [40.69, -74.17], IAD: [38.95, -77.46], DEN: [39.86, -104.67],
  IAH: [29.98, -95.34], MSP: [44.88, -93.22], DTW: [42.21, -83.35],
  PHX: [33.43, -112.01], CLT: [35.21, -80.94], LAS: [36.08, -115.15],
  MCO: [28.43, -81.31], PHL: [39.87, -75.24], BWI: [39.18, -76.67],
  SLC: [40.79, -111.98], SAN: [32.73, -117.19], TPA: [27.98, -82.53],
  PDX: [45.59, -122.60], HNL: [21.32, -157.92], ANC: [61.17, -150.00],
  YUL: [45.47, -73.74], YOW: [45.32, -75.67], CUN: [21.04, -86.87],
  LHR: [51.47, -0.46], CDG: [49.01, 2.55], FRA: [50.03, 8.57],
  AMS: [52.31, 4.77], MAD: [40.49, -3.57], FCO: [41.80, 12.25],
  MUC: [48.35, 11.79], BCN: [41.30, 2.08], IST: [41.26, 28.74],
  ZRH: [47.46, 8.55], LGW: [51.15, -0.18], CPH: [55.62, 12.66],
  DUB: [53.42, -6.27], VIE: [48.11, 16.57], OSL: [60.20, 11.10],
  ARN: [59.65, 17.94], HEL: [60.32, 24.96], LIS: [38.77, -9.13],
  ATH: [37.94, 23.94], WAW: [52.17, 20.97], PRG: [50.10, 14.26],
  BRU: [50.90, 4.48], EDI: [55.95, -3.37], MAN: [53.36, -2.27],
  NRT: [35.76, 140.39], HND: [35.55, 139.78], HKG: [22.31, 113.91],
  SIN: [1.36, 103.99], ICN: [37.46, 126.44], PEK: [40.08, 116.58],
  PVG: [31.14, 121.81], BKK: [13.68, 100.75], KUL: [2.75, 101.71],
  DEL: [28.57, 77.10], BOM: [19.09, 72.87], TPE: [25.08, 121.23],
  CAN: [23.39, 113.30], MNL: [14.51, 121.02], CGK: [-6.13, 106.66],
  KIX: [34.43, 135.23], CTU: [30.58, 103.95], SZX: [22.64, 113.81],
  DXB: [25.25, 55.36], DOH: [25.26, 51.57], AUH: [24.43, 54.65],
  TLV: [32.01, 34.89], RUH: [24.96, 46.70], JED: [21.68, 39.16],
  SYD: [-33.95, 151.18], MEL: [-37.67, 144.84], AKL: [-37.01, 174.79],
  BNE: [-27.38, 153.12], PER: [-31.94, 115.97],
  GRU: [-23.43, -46.47], EZE: [-34.82, -58.54], BOG: [4.70, -74.15],
  SCL: [-33.39, -70.79], LIM: [-12.02, -77.11], GIG: [-22.81, -43.25],
  JNB: [-26.14, 28.25], CAI: [30.12, 31.41], CPT: [-33.97, 18.60],
  NBO: [-1.32, 36.93], ADD: [8.98, 38.80], CMN: [33.37, -7.59],
  LOS: [6.58, 3.32],
}

function hashCoords(code: string): [number, number] {
  let h = 0
  for (let i = 0; i < code.length; i++) h = (h * 31 + code.charCodeAt(i)) & 0xffffffff
  const lat = ((h & 0xffff) / 0xffff) * 140 - 70
  const lon = (((h >> 16) & 0xffff) / 0xffff) * 360 - 180
  return [lat, lon]
}

function getCoords(code: string): [number, number] {
  return AIRPORTS[code.toUpperCase()] || hashCoords(code)
}

function toSphere(lat: number, lon: number, r: number): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)
  return [
    -(r * Math.sin(phi) * Math.cos(theta)),
    r * Math.cos(phi),
    r * Math.sin(phi) * Math.sin(theta),
  ]
}

function midLongitude(lon1: number, lon2: number): number {
  const diff = lon2 - lon1
  if (Math.abs(diff) > 180) {
    const adjusted = diff > 0 ? diff - 360 : diff + 360
    let mid = lon1 + adjusted / 2
    if (mid > 180) mid -= 360
    if (mid < -180) mid += 360
    return mid
  }
  return (lon1 + lon2) / 2
}

const EARTH_TEXTURE_URL =
  'https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/planets/earth_atmos_2048.jpg'

// ── Textured Earth ───────────────────────────────────────────────────
function EarthSphere() {
  const meshRef = useRef<THREE.Mesh>(null)

  useEffect(() => {
    const loader = new THREE.TextureLoader()
    loader.crossOrigin = 'anonymous'
    loader.load(EARTH_TEXTURE_URL, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace
      if (meshRef.current) {
        const mat = meshRef.current.material as THREE.MeshBasicMaterial
        mat.map = texture
        mat.color.set('#5a7a9a')
        mat.needsUpdate = true
      }
    })
  }, [])

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="#0D1520" />
    </mesh>
  )
}

// ── City label on globe ──────────────────────────────────────────────
function CityLabel({ code, position }: { code: string; position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh>
        <sphereGeometry args={[0.025, 12, 12]} />
        <meshBasicMaterial color="#D4603E" />
      </mesh>
      <Html
        center
        distanceFactor={6}
        style={{ pointerEvents: 'none' }}
      >
        <span className="text-[9px] font-semibold text-primary/80 select-none whitespace-nowrap drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
          {code}
        </span>
      </Html>
    </group>
  )
}

// ── Flight route arc + dots + labels ─────────────────────────────────
function FlightRouteArc({
  origin,
  destination,
  isSelected,
}: {
  origin: string
  destination: string
  isSelected: boolean
}) {
  const lineRef = useRef<any>(null)
  const originCoords = useMemo(() => getCoords(origin), [origin])
  const destCoords = useMemo(() => getCoords(destination), [destination])

  const start = useMemo(
    () => new THREE.Vector3(...toSphere(originCoords[0], originCoords[1], 2.01)),
    [originCoords],
  )
  const end = useMemo(
    () => new THREE.Vector3(...toSphere(destCoords[0], destCoords[1], 2.01)),
    [destCoords],
  )
  const mid = useMemo(() => {
    const m = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
    const dist = start.distanceTo(end)
    m.normalize().multiplyScalar(2 + dist * 0.35)
    return m
  }, [start, end])

  const originLabelPos = useMemo<[number, number, number]>(
    () => toSphere(originCoords[0], originCoords[1], 2.08),
    [originCoords],
  )
  const destLabelPos = useMemo<[number, number, number]>(
    () => toSphere(destCoords[0], destCoords[1], 2.08),
    [destCoords],
  )

  useFrame((_, delta) => {
    if (lineRef.current?.material) {
      lineRef.current.material.dashOffset -= delta * 0.4
    }
  })

  return (
    <>
      <QuadraticBezierLine
        ref={lineRef}
        start={start}
        end={end}
        mid={mid}
        color={isSelected ? '#D4603E' : '#6a3828'}
        lineWidth={isSelected ? 2.5 : 1}
        dashed
        dashScale={6}
        dashSize={0.5}
        dashOffset={0}
      />
      {isSelected && (
        <>
          <CityLabel code={origin} position={originLabelPos} />
          <CityLabel code={destination} position={destLabelPos} />
        </>
      )}
    </>
  )
}

// ── Globe group ──────────────────────────────────────────────────────
interface FlightRouteData {
  origin: string
  destination: string
}

function GlobeGroup({
  flights,
  selectedIndex,
}: {
  flights: FlightRouteData[]
  selectedIndex: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const isDragging = useRef(false)

  const targetRotY = useMemo(() => {
    const selected = flights[selectedIndex]
    if (!selected) return null
    const oCoords = getCoords(selected.origin)
    const dCoords = getCoords(selected.destination)
    const midLon = midLongitude(oCoords[1], dCoords[1])
    return -(midLon + 90) * (Math.PI / 180)
  }, [flights, selectedIndex])

  useFrame((_, delta) => {
    if (!groupRef.current) return
    if (targetRotY !== null && !isDragging.current) {
      let diff = targetRotY - groupRef.current.rotation.y
      while (diff > Math.PI) diff -= Math.PI * 2
      while (diff < -Math.PI) diff += Math.PI * 2
      groupRef.current.rotation.y += diff * Math.min(delta * 2.5, 1)
      if (Math.abs(diff) < 0.02) {
        groupRef.current.rotation.y += delta * 0.015
      }
    } else if (!isDragging.current) {
      groupRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <group ref={groupRef}>
      <EarthSphere />
      {/* Faint wireframe grid overlay */}
      <mesh>
        <sphereGeometry args={[2.003, 36, 36]} />
        <meshBasicMaterial color="#4A7FB5" wireframe transparent opacity={0.06} />
      </mesh>
      {/* Atmosphere glow */}
      <mesh>
        <sphereGeometry args={[2.2, 48, 48]} />
        <meshBasicMaterial color="#4A8BC2" side={THREE.BackSide} transparent opacity={0.1} />
      </mesh>
      {/* Flight routes */}
      {flights.map((f, i) => (
        <FlightRouteArc
          key={`${f.origin}-${f.destination}-${i}`}
          origin={f.origin}
          destination={f.destination}
          isSelected={i === selectedIndex}
        />
      ))}
    </group>
  )
}

// ── Scene ────────────────────────────────────────────────────────────
interface GlobeProps {
  flights: FlightRouteData[]
  selectedIndex: number
}

function Scene({ flights, selectedIndex }: GlobeProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <GlobeGroup flights={flights} selectedIndex={selectedIndex} />
      <Stars radius={80} depth={60} count={500} factor={2.5} saturation={0} fade speed={0.3} />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        rotateSpeed={0.4}
        minPolarAngle={Math.PI * 0.2}
        maxPolarAngle={Math.PI * 0.8}
      />
    </>
  )
}

// ── Canvas mount ─────────────────────────────────────────────────────
export default function GlobeBackground({ flights = [], selectedIndex = 0 }: GlobeProps) {
  return (
    <div className="absolute inset-0 w-full h-full">
      <Canvas
        camera={{ position: [0, 1.5, 5], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ alpha: true, antialias: true }}
        style={{ background: 'transparent' }}
      >
        <Scene flights={flights} selectedIndex={selectedIndex} />
      </Canvas>
    </div>
  )
}
