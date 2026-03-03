'use client'

import dynamic from 'next/dynamic'

const GlobeBackground = dynamic(() => import('@/components/GlobeBackground'), {
  ssr: false,
})

interface GlobeWrapperProps {
  origin?: string
  destination?: string
}

export default function GlobeWrapper({ origin, destination }: GlobeWrapperProps) {
  return <GlobeBackground origin={origin} destination={destination} />
}
