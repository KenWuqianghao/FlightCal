'use client';

import { FlightInfo } from "@/types/flight";
import { ArrowRight, Clock, CalendarDays, MapPin, Building2, Ticket, Plane } from "lucide-react"
import { format as formatDateFn, parseISO, intervalToDuration } from 'date-fns';
import { getGoogleCalendarLink } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { DownloadIcsButton } from "./DownloadIcsButton";
import Image from "next/image";

interface AdaptedFlightCardProps {
  flight: FlightInfo;
}

function calculateDuration(startTimeISO: string, endTimeISO: string): string | null {
  try {
    const start = parseISO(startTimeISO);
    const end = parseISO(endTimeISO);
    if (isNaN(start.valueOf()) || isNaN(end.valueOf()) || end <= start) return null;

    const durationData = intervalToDuration({ start, end });
    
    let parts = [];
    if (durationData.hours) parts.push(`${durationData.hours}h`);
    if (durationData.minutes) parts.push(`${durationData.minutes}m`);
    
    return parts.length > 0 ? parts.join(' ') : null;
  } catch (e) {
    console.error("Error calculating duration:", e);
    return null;
  }
}

export default function FlightCard({ flight }: AdaptedFlightCardProps) {
  const airline = flight.airline;
  const flightNumber = flight.flightNumber;
  
  const departureTimeFormatted = flight.departureTime 
    ? formatDateFn(parseISO(flight.departureTime), "HH:mm") 
    : "N/A";
  const arrivalTimeFormatted = flight.arrivalTime 
    ? formatDateFn(parseISO(flight.arrivalTime), "HH:mm") 
    : "N/A";

  const originCode = flight.origin;
  const destinationCode = flight.destination;
  const originCity = flight.originMunicipalityName;
  const destinationCity = flight.destinationMunicipalityName;
  
  const duration = calculateDuration(flight.departureTime, flight.arrivalTime);
  
  const logoUrl = flight.airlineIata 
    ? `https://pics.avs.io/80/80/${flight.airlineIata.toUpperCase()}.png`
    : "/placeholder.svg";

  const departureGate = flight.departureGate;
  const departureTerminal = flight.departureTerminal;

  const googleCalendarLink = getGoogleCalendarLink(flight);

  return (
    <div className="w-full max-w-xl group perspective-1000 animate-in fade-in slide-in-from-bottom-12 duration-1000 ease-out">
      <div className="glass-card rounded-[3rem] overflow-hidden shadow-[0_64px_120px_-24px_rgba(0,0,0,0.9)] border border-white/5 transition-all duration-700 hover:scale-[1.03] hover:shadow-[0_80px_160px_-12px_rgba(0,0,0,1)] tilt-3d preserve-3d">
        {/* Animated Accent Line */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary/80 to-transparent opacity-100"></div>

        {/* Header Section */}
        <div className="p-10 pb-6 relative overflow-hidden">
          {/* Subtle Glow Background */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-primary/10 blur-[80px] -translate-x-1/2 -translate-y-1/2 opacity-60"></div>

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-6">
              <div className="flex h-18 w-18 items-center justify-center overflow-hidden rounded-[1.5rem] bg-white/[0.05] border border-white/10 shadow-2xl backdrop-blur-md transition-transform group-hover:scale-110 duration-500">
                <Image
                  src={logoUrl} 
                  alt={`${airline || 'Airline'} logo`} 
                  width={48}
                  height={48}
                  className="h-12 w-12 object-contain brightness-110 contrast-125"
                  unoptimized={logoUrl.startsWith('http')}
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tighter text-white">{airline || "N/A"}</h3>
                <div className="flex items-center gap-2.5 text-primary/60">
                  <Ticket className="h-4 w-4" />
                  <p className="text-xs font-black uppercase tracking-[0.25em]">{flightNumber || "N/A"}</p>
                </div>
              </div>
            </div>
            {duration && (
              <div className="flex flex-col items-end gap-1.5">
                <div className="flex items-center gap-2 rounded-2xl bg-primary/10 border border-primary/20 px-5 py-2.5 shadow-inner backdrop-blur-md">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-sm font-black text-primary uppercase tracking-wider">{duration}</span>
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.1em] text-white/20">Duration</span>
              </div>
            )}
          </div>
        </div>

        {/* Live Flight Path Visualization */}
        <div className="px-10 py-10 relative">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-10 mb-16 relative">
            {/* Departure Node */}
            <div className="flex flex-col items-start space-y-2 group/node">
              <div className="relative">
                <span className="text-6xl font-black tracking-tighter text-white drop-shadow-2xl group-hover/node:text-primary transition-colors duration-500">{departureTimeFormatted}</span>
                <div className="absolute -top-6 -left-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Departure</div>
              </div>
              <div className="flex flex-col">
                <span className="text-3xl font-black tracking-tight text-primary uppercase">{originCode || "N/A"}</span>
                {originCity && <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] truncate max-w-[140px]">{originCity}</span>}
              </div>
            </div>

            {/* Live Visualization Path */}
            <div className="flex flex-col items-center justify-center min-w-[100px] relative h-20">
              {/* The Path Line */}
              <div className="absolute h-[2px] w-[140%] bg-white/5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent animate-pulse"></div>
              </div>

              {/* Dynamic Plane and Dash Path */}
              <div className="relative w-32 flex items-center justify-center">
                 <div className="absolute w-full h-[1px] border-b border-dashed border-white/20"></div>
                 <div className="relative transform group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute -inset-4 bg-primary/20 blur-xl rounded-full animate-blob"></div>
                    <Plane className="h-10 w-10 text-primary drop-shadow-[0_0_15px_rgba(217,110,96,0.8)] rotate-90 relative z-10" />
                 </div>
              </div>
              <div className="absolute -bottom-2 text-[10px] font-black text-primary/40 uppercase tracking-[0.2em] animate-pulse">In Transit</div>
            </div>

            {/* Arrival Node */}
            <div className="flex flex-col items-end space-y-2 group/node">
              <div className="relative">
                <span className="text-6xl font-black tracking-tighter text-white drop-shadow-2xl group-hover/node:text-primary transition-colors duration-500">{arrivalTimeFormatted}</span>
                <div className="absolute -top-6 -right-2 text-[10px] font-black uppercase tracking-[0.2em] text-white/20 text-right">Arrival</div>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-3xl font-black tracking-tight text-primary uppercase">{destinationCode || "N/A"}</span>
                {destinationCity && <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.15em] text-right truncate max-w-[140px]">{destinationCity}</span>}
              </div>
            </div>
          </div>

          {/* Details Grid with 3D feel */}
          <div className="grid grid-cols-2 gap-6">
             <div className="glass-card rounded-[2rem] p-6 flex items-center gap-5 transition-all duration-500 hover:bg-white/[0.08] hover:translate-y-[-4px] hover:shadow-xl group/item">
                <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center transition-transform group-hover/item:scale-110 group-hover/item:border-primary/40">
                  <Building2 className="h-6 w-6 text-white/40 group-hover/item:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5">Terminal</p>
                  <p className="text-2xl font-black text-white">{departureTerminal || "—"}</p>
                </div>
             </div>
             <div className="glass-card rounded-[2rem] p-6 flex items-center gap-5 transition-all duration-500 hover:bg-white/[0.08] hover:translate-y-[-4px] hover:shadow-xl group/item">
                <div className="h-14 w-14 rounded-2xl bg-white/[0.05] border border-white/10 flex items-center justify-center transition-transform group-hover/item:scale-110 group-hover/item:border-primary/40">
                  <MapPin className="h-6 w-6 text-white/40 group-hover/item:text-primary transition-colors" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20 mb-0.5">Gate</p>
                  <p className="text-2xl font-black text-white">{departureGate || "—"}</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Action Bar */}
        <div className="p-8 bg-black/50 border-t border-white/5 backdrop-blur-3xl flex flex-col sm:flex-row gap-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          <Button
            asChild
            className="flex-1 h-18 rounded-[1.5rem] bg-white text-black hover:bg-primary hover:text-white font-black text-lg transition-all duration-500 transform active:scale-95 shadow-2xl relative z-10"
          >
            <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-3">
              <CalendarDays className="h-6 w-6" />
              Add to Google
            </a>
          </Button>
          <DownloadIcsButton 
            flight={flight} 
            className="flex-1 h-18 rounded-[1.5rem] bg-white/[0.08] hover:bg-white/[0.12] text-white font-black text-lg border-white/10 backdrop-blur-md transition-all duration-500 transform active:scale-95 relative z-10"
          />
        </div>
      </div>

      {/* Dynamic Floor Shadow */}
      <div className="mt-12 mx-auto w-3/4 h-3 bg-primary/20 blur-2xl rounded-full opacity-40 group-hover:opacity-80 group-hover:scale-110 transition-all duration-700"></div>
    </div>
  )
}
