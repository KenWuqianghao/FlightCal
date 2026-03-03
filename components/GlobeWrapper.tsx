'use client'

import dynamic from 'next/dynamic'

const GlobeBackground = dynamic(() => import('@/components/GlobeBackground'), {
  ssr: false,
})

interface GlobeWrapperProps {
  flights: Array<{ origin: string; destination: string }>
  selectedIndex: number
}

export default function GlobeWrapper({ flights, selectedIndex }: GlobeWrapperProps) {
  return <GlobeBackground flights={flights} selectedIndex={selectedIndex} />
}
