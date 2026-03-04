'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from '@phosphor-icons/react'
import { FlightInfo } from '@/types/flight'
import { FlightSelector } from './flight-selector'
import FlightCard from './FlightCard'
import GlobeWrapper from './GlobeWrapper'
import { cn } from '@/lib/utils'

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

export default function FlightApp() {
  const [flights, setFlights] = useState<FlightInfo[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)

  const hasResult = flights.length > 0
  const selectedFlight = flights[selectedIndex] ?? null

  const handleFlightFound = (data: FlightInfo) => {
    setFlights(prev => [data, ...prev])
    setSelectedIndex(0)
  }

  const globeRoutes = flights.map(f => ({ origin: f.origin, destination: f.destination }))

  return (
    <main className="relative min-h-[100dvh] overflow-hidden bg-background text-foreground">
      {/* Globe */}
      <div className="absolute inset-0 lg:left-[40%] opacity-30 lg:opacity-100 transition-opacity duration-700">
        <GlobeWrapper flights={globeRoutes} selectedIndex={selectedIndex} />
      </div>

      {/* Content grid */}
      <div className="relative z-10 grid min-h-[100dvh] grid-cols-1 lg:grid-cols-[1fr_0.6fr] pointer-events-none">
        <div className="pointer-events-auto flex flex-col justify-center w-full px-4 py-6 lg:px-16 lg:py-8">
          {/* Runway accent */}
          <div
            className="w-12 h-[2px] bg-primary mb-5 origin-left"
            style={{ animation: 'scaleX 0.6s ease-out 0.3s both' }}
          />

          {/* Header */}
          <motion.header layout transition={spring} className={hasResult ? 'mb-3' : 'mb-10'}>
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
          <FlightSelector onFlightFound={handleFlightFound} hasResult={hasResult} />

          {/* Flight history chips */}
          {flights.length > 1 && (
            <div className="flex gap-2 overflow-x-auto mt-3 pb-1 scrollbar-none">
              {flights.map((f, i) => (
                <button
                  key={`${f.flightNumber}-${f.departureTime}-${i}`}
                  onClick={() => setSelectedIndex(i)}
                  aria-label={`View details for flight ${f.flightNumber} from ${f.origin} to ${f.destination}`}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    i === selectedIndex
                      ? "bg-primary/15 border border-primary/25 text-primary"
                      : "bg-white/[0.04] border border-white/[0.06] text-muted-foreground hover:bg-white/[0.08]"
                  )}
                >
                  <span className="font-semibold">{f.flightNumber}</span>
                  <span className="opacity-50">{f.origin}</span>
                  <ArrowRight className="h-2.5 w-2.5 opacity-30" />
                  <span className="opacity-50">{f.destination}</span>
                </button>
              ))}
            </div>
          )}

          {/* Flight card */}
          <AnimatePresence mode="wait">
            {selectedFlight && (
              <motion.div
                key={`${selectedFlight.flightNumber}-${selectedFlight.departureTime}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ ...spring, delay: 0.1 }}
                className="mt-3"
              >
                <FlightCard flight={selectedFlight} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer */}
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
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </main>
  )
}
