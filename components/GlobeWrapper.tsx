'use client'

import dynamic from 'next/dynamic'

const GlobeBackground = dynamic(() => import('@/components/GlobeBackground'), {
  ssr: false,
})

export default function GlobeWrapper() {
  return <GlobeBackground />
}
