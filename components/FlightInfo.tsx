import { FlightInfo } from "@/types/flight";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaneTakeoff, PlaneLanding, Plane, CalendarDays, Clock } from "lucide-react";
import { format as formatDateFn, parseISO } from 'date-fns';
import { CalendarButton } from "./CalendarButton";

interface FlightInfoProps {
  flight: FlightInfo;
}

export function FlightInfoDisplay({ flight }: FlightInfoProps) {
  const formatDate = (dateString: string) => {
    try {
      const dateObj = parseISO(dateString);
      return formatDateFn(dateObj, "MMM d, yyyy, h:mm a");
    } catch (e) {
      console.error("Error formatting date:", e);
      return dateString;
    }
  };

  return (
    <Card className="w-full animate-fade-in shadow-md border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-gray-50 dark:bg-gray-800 p-4 rounded-t-lg">
        <div className="flex items-center space-x-2.5">
          <Plane className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            {flight.airline} {flight.flightNumber}
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Column 1: Origin & Departure */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <PlaneTakeoff className="h-4 w-4 text-green-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Origin</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-100">{flight.origin}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <CalendarDays className="h-4 w-4 text-indigo-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Departure</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(flight.departureTime)}</p>
              </div>
            </div>
          </div>

          {/* Column 2: Destination & Arrival */}
          <div className="space-y-3">
            <div className="flex items-start space-x-2">
              <PlaneLanding className="h-4 w-4 text-red-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Destination</p>
                <p className="text-base font-medium text-gray-800 dark:text-gray-100">{flight.destination}</p>
              </div>
            </div>
            <div className="flex items-start space-x-2">
              <Clock className="h-4 w-4 text-purple-600 mt-1 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">Arrival</p>
                <p className="text-sm text-gray-700 dark:text-gray-300">{formatDate(flight.arrivalTime)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-5 text-center md:text-right">
            <CalendarButton flight={flight} />
        </div>
      </CardContent>
    </Card>
  );
} 