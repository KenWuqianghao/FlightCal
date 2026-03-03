'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FlightInfo } from '@/types/flight'
import { FlightSelector } from './flight-selector'
import FlightCard from './FlightCard'
import GlobeWrapper from './GlobeWrapper'

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

export default function FlightApp() {
  const [flightData, setFlightData] = useState<FlightInfo | null>(null)
  const hasResult = !!flightData

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Globe */}
      <div className="absolute inset-0 lg:left-[40%] opacity-30 lg:opacity-100 transition-opacity duration-700">
        <GlobeWrapper
          origin={flightData?.origin}
          destination={flightData?.destination}
        />
      </div>

      {/* Content grid */}
      <div className="relative z-10 grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[1fr_0.6fr]">
        <div className="flex flex-col justify-center w-full px-4 py-6 lg:px-16 lg:py-8">
          {/* Runway accent */}
          <div
            className="w-12 h-[2px] bg-primary mb-5 origin-left"
            style={{ animation: 'scaleX 0.6s ease-out 0.3s both' }}
          />

          {/* Header — shrinks when result is showing */}
          <motion.header
            layout
            transition={spring}
            className={hasResult ? 'mb-3' : 'mb-10'}
          >
            <motion.h1
              layout="position"
              transition={spring}
              className={`font-bold tracking-tight text-foreground transition-all duration-500 ${
                hasResult ? 'text-2xl lg:text-3xl mb-0.5' : 'text-4xl lg:text-5xl mb-3'
              }`}
            >
              FlightCal
            </motion.h1>
            <AnimatePresence>
              {!hasResult && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={spring}
                  className="text-muted-foreground text-sm tracking-wide"
                >
                  Search your flight. Export to calendar.
                </motion.p>
              )}
            </AnimatePresence>
          </motion.header>

          {/* Form */}
          <FlightSelector onFlightFound={setFlightData} hasResult={hasResult} />

          {/* Flight card */}
          <AnimatePresence mode="wait">
            {flightData && (
              <motion.div
                key={flightData.flightNumber}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ ...spring, delay: 0.1 }}
                className="mt-4"
              >
                <FlightCard flight={flightData} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer — hidden when card is showing */}
          {!hasResult && (
            <footer className="mt-16 text-white/15 text-[10px] font-medium uppercase tracking-[0.2em]">
              Precision aviation tools
            </footer>
          )}
        </div>

        <div className="hidden lg:block" aria-hidden="true" />
      </div>

      <style>{`
        @keyframes scaleX {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
    </main>
  )
}
