'use client';

import { FlightInfo } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { getGoogleCalendarLink } from "@/lib/calendar";
import { CalendarPlus } from 'lucide-react';

interface CalendarButtonProps {
  flight: FlightInfo;
  className?: string;
}

export function CalendarButton({ flight, className }: CalendarButtonProps) {
  const handleAddToCalendar = () => {
    const calendarLink = getGoogleCalendarLink(flight);
    window.open(calendarLink, '_blank', 'noopener,noreferrer');
  };

  return (
    <Button 
      onClick={handleAddToCalendar} 
      variant="outline" 
      className={`mt-4 w-full md:w-auto ${className || ''}`}
    >
      <CalendarPlus className="mr-2 h-4 w-4" />
      Add to Google Calendar
    </Button>
  );
} 