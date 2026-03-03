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
  hidden: { opacity: 0, y: 10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { ...spring, delay: 0.4 + i * 0.08 },
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
    <div className="w-full">
      <div className="glass-surface rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-lg bg-white shadow-sm">
                <Image
                  src={logoUrl}
                  alt={`${airline || 'Airline'} logo`}
                  width={28}
                  height={28}
                  className="h-7 w-7 object-contain"
                  unoptimized={logoUrl.startsWith('http')}
                />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white leading-tight">{airline || "N/A"}</h3>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Ticket className="h-3 w-3" weight="duotone" />
                  <p className="text-[11px] font-medium tracking-wide">{flightNumber || "N/A"}</p>
                </div>
              </div>
            </div>
            {duration && (
              <div className="flex items-center gap-1.5 rounded-md bg-primary/10 border border-primary/15 px-2.5 py-1">
                <Clock className="h-3 w-3 text-primary" weight="duotone" />
                <span className="text-[11px] font-semibold text-primary">{duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Flight path with SVG arc */}
        <div className="px-5 py-4">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-4">
            {/* Departure */}
            <div className="flex flex-col items-start">
              <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground/50">Dep</span>
              <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">{departureTimeFormatted}</span>
              <span className="text-base font-bold tracking-tight text-primary mt-0.5">{originCode || "N/A"}</span>
              {originCity && <span className="text-[9px] text-muted-foreground/60 truncate max-w-[120px]">{originCity}</span>}
            </div>

            {/* SVG flight arc */}
            <div className="flex flex-col items-center justify-center min-w-[64px]">
              <svg viewBox="0 0 100 50" className="w-20 h-10" fill="none">
                <motion.path
                  d="M 8 42 Q 50 -8 92 42"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1.5"
                  strokeDasharray="4 3"
                  fill="none"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeInOut", delay: 0.3 }}
                />
                <motion.circle
                  cx="50"
                  cy="6"
                  r="2.5"
                  fill="hsl(var(--primary))"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.8 }}
                  transition={{ delay: 1.0 }}
                />
              </svg>
              <AirplaneTilt className="h-3.5 w-3.5 text-primary/50" weight="fill" />
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-end">
              <span className="text-[9px] font-medium uppercase tracking-[0.12em] text-muted-foreground/50 text-right">Arr</span>
              <span className="text-3xl lg:text-4xl font-bold tracking-tight text-white leading-none">{arrivalTimeFormatted}</span>
              <span className="text-base font-bold tracking-tight text-primary mt-0.5">{destinationCode || "N/A"}</span>
              {destinationCity && <span className="text-[9px] text-muted-foreground/60 text-right truncate max-w-[120px]">{destinationCity}</span>}
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            <motion.div
              custom={0}
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 flex items-center gap-2.5"
            >
              <div className="h-8 w-8 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                <Buildings className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground/50">Terminal</p>
                <p className="text-base font-semibold text-white leading-tight">{departureTerminal || "\u2014"}</p>
              </div>
            </motion.div>
            <motion.div
              custom={1}
              variants={detailVariants}
              initial="hidden"
              animate="visible"
              className="rounded-lg bg-white/[0.03] border border-white/[0.06] px-3 py-2.5 flex items-center gap-2.5"
            >
              <div className="h-8 w-8 rounded-md bg-white/[0.05] border border-white/[0.06] flex items-center justify-center shrink-0">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" weight="duotone" />
              </div>
              <div>
                <p className="text-[9px] font-medium uppercase tracking-[0.1em] text-muted-foreground/50">Gate</p>
                <p className="text-base font-semibold text-white leading-tight">{departureGate || "\u2014"}</p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="px-5 py-3 border-t border-white/[0.06] flex flex-col sm:flex-row gap-2">
          <Button
            asChild
            className="flex-1 h-10 rounded-lg bg-white text-black hover:bg-white/90 font-semibold text-sm transition-all duration-200 active:scale-[0.98]"
          >
            <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
              <CalendarDots className="h-4 w-4" weight="duotone" />
              Add to Google
            </a>
          </Button>
          <DownloadIcsButton
            flight={flight}
            className="flex-1 h-10 rounded-lg bg-white/[0.06] hover:bg-white/[0.10] text-white font-semibold text-sm border-white/[0.08] transition-all duration-200 active:scale-[0.98]"
          />
        </div>
      </div>
    </div>
  )
}
