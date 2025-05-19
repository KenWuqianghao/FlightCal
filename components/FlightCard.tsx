'use client'; // Add use client for date-fns and event handlers if any implicit ones exist

import { FlightInfo } from "@/types/flight";
import { ArrowRight, Clock, Download, CalendarDays } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { format as formatDateFn, parseISO, intervalToDuration } from 'date-fns';
import { getGoogleCalendarLink } from "@/lib/calendar";
import { Button } from "@/components/ui/button";
import { DownloadIcsButton } from "./DownloadIcsButton";

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
  
  // Construct logo URL using Travelpayouts Aviasales service
  const logoUrl = flight.airlineIata 
    ? `http://pics.avs.io/40/40/${flight.airlineIata.toUpperCase()}.png` 
    : "/placeholder.svg"; // Fallback to placeholder

  const departureGate = flight.departureGate;
  const departureTerminal = flight.departureTerminal;

  const googleCalendarLink = getGoogleCalendarLink(flight);

  return (
    <Card className="w-full max-w-md overflow-hidden border shadow-sm transition-all hover:shadow-md">
      <CardContent className="p-0">
        {/* Airline Header */}
        <div className="border-b bg-muted/30 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-background">
                {/* Use an onError handler for the image to fall back to placeholder if logo fails to load */}
                <img 
                  src={logoUrl} 
                  alt={`${airline || 'Airline'} logo`} 
                  className="h-6 w-6 object-contain" 
                  onError={(e) => {
                    // Type assertion to satisfy TypeScript for currentTarget
                    const target = e.currentTarget as HTMLImageElement;
                    target.onerror = null; // Prevent infinite loop if placeholder also fails
                    target.src = "/placeholder.svg"; 
                  }}
                />
              </div>
              <div>
                <h3 className="font-medium text-foreground">{airline || "N/A"}</h3>
                <p className="text-xs text-muted-foreground">Flight {flightNumber || "N/A"}</p>
              </div>
            </div>
            {duration && (
              <div className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1">
                <Clock className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium text-primary">{duration}</span>
              </div>
            )}
          </div>
        </div>

        {/* Flight Details */}
        <div className="p-4">
          <div className="flex items-center justify-between">
            {/* Departure */}
            <div className="flex flex-col items-start">
              <span className="text-3xl font-bold tracking-tight">{departureTimeFormatted}</span>
              <span className="text-sm font-medium text-foreground">{originCode || "N/A"}</span>
              {originCity && <span className="text-xs text-muted-foreground">{originCity}</span>}
            </div>

            {/* Flight Path Visualization */}
            <div className="flex-1 px-4">
              <div className="relative flex items-center justify-center">
                <div className="absolute h-[1px] w-full bg-border"></div>
                <div className="absolute left-0 h-2 w-2 rounded-full bg-muted-foreground"></div>
                <ArrowRight className="relative z-10 h-5 w-5 text-primary" />
                <div className="absolute right-0 h-2 w-2 rounded-full bg-primary"></div>
              </div>
            </div>

            {/* Arrival */}
            <div className="flex flex-col items-end">
              <span className="text-3xl font-bold tracking-tight">{arrivalTimeFormatted}</span>
              <span className="text-sm font-medium text-foreground">{destinationCode || "N/A"}</span>
              {destinationCity && <span className="text-xs text-muted-foreground">{destinationCity}</span>}
            </div>
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="grid grid-cols-2 divide-x border-t bg-muted/20">
          <div className="flex flex-col items-center p-3">
            <span className="text-xs text-muted-foreground">Gate</span>
            <span className="font-medium">{departureGate || "N/A"}</span>
          </div>
          <div className="flex flex-col items-center p-3">
            <span className="text-xs text-muted-foreground">Terminal</span>
            <span className="font-medium">{departureTerminal || "N/A"}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-2 p-4 border-t border-muted md:flex-row md:gap-2">
          <Button
            asChild
            variant="outline"
            className="w-full flex-1 md:w-auto md:flex-initial"
          >
            <a href={googleCalendarLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
              <CalendarDays className="mr-2 h-4 w-4" />
              Google Calendar
            </a>
          </Button>
          <DownloadIcsButton 
            flight={flight} 
            className="w-full flex-1 md:w-auto md:flex-initial" 
          />
        </div>
      </CardContent>
    </Card>
  )
} 