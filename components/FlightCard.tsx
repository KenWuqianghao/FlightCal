'use client'

import { FlightInfo } from "@/types/flight"
import { motion } from "framer-motion"
import { Clock, Ticket, Buildings, MapPin, CalendarDots, AirplaneTilt } from "@phosphor-icons/react"
import { format as formatDateFn, parseISO, intervalToDuration } from 'date-fns'
import { getGoogleCalendarLink } from "@/lib/calendar"
import { Button } from "@/components/ui/button"
import { DownloadIcsButton } from "./DownloadIcsButton"
import Image from "next/image"

interface AdaptedFlightCardProps {
  flight: FlightInfo
}

function calculateDuration(startTimeISO: string, endTimeISO: string): string | null {
  try {
    const start = parseISO(startTimeISO)
    const end = parseISO(endTimeISO)
    if (isNaN(start.valueOf()) || isNaN(end.valueOf()) || end <= start) return null
    const durationData = intervalToDuration({ start, end })
    const parts = []
    if (durationData.hours) parts.push(`${durationData.hours}h`)
    if (durationData.minutes) parts.push(`${durationData.minutes}m`)
    return parts.length > 0 ? parts.join(' ') : null
  } catch {
    return null
  }
}

const spring = { type: "spring" as const, stiffness: 300, damping: 30 }

const detailVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay: 0.6 + i * 0.1 },
  }),
}

export default function FlightCard({ flight }: AdaptedFlightCardProps) {
  const airline = flight.airline
  const flightNumber = flight.flightNumber

  const departureTimeFormatted = flight.departureTime
    ? formatDateFn(parseISO(flight.departureTime), "HH:mm")
    : "N/A"
  const arrivalTimeFormatted = flight.arrivalTime
    ? formatDateFn(parseISO(flight.arrivalTime), "HH:mm")
    : "N/A"

  const originCode = flight.origin
  const destinationCode = flight.destination
  const originCity = flight.originMunicipalityName
  const destinationCity = flight.destinationMunicipalityName

  const duration = calculateDuration(flight.departureTime, flight.arrivalTime)

  const logoUrl = flight.airlineIata
    ? `https://pics.avs.io/80/80/${flight.airlineIata.toUpperCase()}.png`
    : "/placeholder.svg"

  const departureGate = flight.departureGate
  const departureTerminal = flight.departureTerminal

  const googleCalendarLink = getGoogleCalendarLink(flight)

  return (
    <div className="w-full max-w-xl">
      <div className="glass-surface rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="p-8 pb-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-white/[0.05] border border-white/[0.08]">
                <Image
                  src={logoUrl}
                  alt={`${airline || 'Airline'} logo`}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-contain"
                  unoptimized={logoUrl.startsWith('http')}
                />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{airline || "N/A"}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Ticket className="h-3.5 w-3.5" weight="duotone" />
                  <p className="text-xs font-medium tracking-wide">{flightNumber || "N/A"}</p>
                </div>
              </div>
            </div>
            {duration && (
              <div className="flex items-center gap-1.5 rounded-lg bg-primary/10 border border-primary/15 px-3 py-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" weight="duotone" />
                <span className="text-xs font-semibold text-primary">{duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Flight path with SVG arc */}
        <div className="px-8 py-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-6 mb-8">
            {/* Departure */}
            <div className="flex flex-col items-start space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60">Departure</span>
              <span className="text-4xl lg:text-6xl font-bold tracking-tight text-white">{departureTimeFormatted}</span>
              <span className="text-xl font-bold tracking-tight text-primary">{originCode || "N/A"}</span>
              {originCity && <span className="text-[10px] text-muted-foreground truncate max-w-[140px]">{originCity}</span>}
            </div>

            {/* SVG flight arc */}
            <div className="flex flex-col items-center justify-center min-w-[80px] relative">
              <svg viewBox="0 0 120 60" className="w-28 h-14" fill="none">
                <motion.path
                  d="M 10 50 Q 60 -10 110 50"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.0 }}
                >
                  <circle cx="60" cy="8" r="3" fill="hsl(var(--primary))" opacity="0.8" />
                </motion.g>
              </svg>
              <AirplaneTilt className="h-4 w-4 text-primary/60 mt-1" weight="fill" />
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-end space-y-1">
              <span className="text-[10px] font-medium uppercase tracking-[0.15em] text-muted-foreground/60 text-right">Arrival</span>
              <span className="text-4xl lg:text-6xl font-bold tracking-tight text-white">{arrivalTimeFormatted}</span>
              <span className="text-xl font-bold tracking-tight text-primary">{destinationCode || "N/A"}</span>
              {destinationCity && <span className="text-[10px] text-muted-foreground text-right truncate max-w-[140px]">{destinationCity}</span>}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <motion.div
              custom={0}
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
                <Buildings className="h-4.5 w-4.5 text-muted-foreground" weight="duotone" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60 mb-0.5">Terminal</p>
                <p className="text-lg font-semibold text-white">{departureTerminal || "—"}</p>
              </div>
            </motion.div>
            <motion.div
              custom={1}
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-4 flex items-center gap-3"
            >
              <div className="h-10 w-10 rounded-lg bg-white/[0.05] border border-white/[0.06] flex items-center justify-center">
                <MapPin className="h-4.5 w-4.5 text-muted-foreground" weight="duotone" />
              </div>
              <div>
                <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground/60 mb-0.5">Gate</p>
                <p className="text-lg font-semibold text-white">{departureGate || "—"}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-6 border-t border-white/[0.06] flex flex-col sm:flex-row gap-3">
          <Button
            asChild
            className="flex-1 h-12 rounded-xl bg-white text-black hover:bg-white/90 font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
          >
            <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <CalendarDots className="h-4.5 w-4.5" weight="duotone" />
              Add to Google
            </a>
          </Button>
          <DownloadIcsButton
            flight={flight}
            className="flex-1 h-12 rounded-xl bg-white/[0.06] hover:bg-white/[0.10] text-white font-semibold text-sm border-white/[0.08] transition-all duration-200 active:scale-[0.98]"
          />
        </div>
      </div>
    </div>
  )
}
