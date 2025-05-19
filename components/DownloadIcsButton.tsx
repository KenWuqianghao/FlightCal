'use client';

import { FlightInfo } from "@/types/flight";
import { Button } from "@/components/ui/button";
import { generateIcsContent } from "@/lib/calendar";
import { Download } from 'lucide-react'; 
import { useToast } from "@/hooks/use-toast";

interface DownloadIcsButtonProps {
  flight: FlightInfo;
  className?: string;
}

export function DownloadIcsButton({ flight, className }: DownloadIcsButtonProps) {
  const { toast } = useToast();

  const handleDownloadIcs = () => {
    const icsContent = generateIcsContent(flight);

    if (!icsContent) {
      toast({
        title: "Error Generating .ics File",
        description: "Could not generate the calendar file. Please try again.",
        variant: "destructive",
      });
      return;
    }

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    
    const safeFlightNumber = flight.flightNumber.replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `flight_${safeFlightNumber}.ics`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);

    toast({
      title: ".ics File Downloaded",
      description: "The flight event has been downloaded.",
    });
  };

  return (
    <Button 
      onClick={handleDownloadIcs} 
      variant="outline" 
      className={`w-full md:w-auto ${className || ''}`}
    >
      <Download className="mr-2 h-4 w-4" />
      Download .ics
    </Button>
  );
} 