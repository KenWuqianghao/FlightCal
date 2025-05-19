import { FlightInfo } from "@/types/flight";
import { parseISO, format as formatDateFn } from 'date-fns';
import * as ics from 'ics'; // Import the ics library

// Helper function to format a Date object into YYYYMMDDTHHMMSSZ UTC string
function getUtcCalendarString(date: Date): string {
  const year = date.getUTCFullYear();
  const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // getUTCMonth is 0-indexed
  const day = date.getUTCDate().toString().padStart(2, '0');
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');
  return `${year}${month}${day}T${hours}${minutes}${seconds}Z`;
}

// Helper to format ISO string to readable local time, returns null if formatting fails
function formatToReadable(isoString: string | undefined): string | null {
  if (!isoString) return null;
  try {
    return formatDateFn(parseISO(isoString), "MMM d, yyyy, h:mm a");
  } catch (e) {
    console.error(`Error formatting date string for description: ${isoString}`, e);
    return null; // Or return isoString if you prefer to show the raw data on error
  }
}

/**
 * Generates a Google Calendar event link for the given flight information.
 * @param flight The flight information.
 * @returns A URL string for creating a Google Calendar event.
 */
export function getGoogleCalendarLink(flight: FlightInfo): string {
  const title = `Flight ${flight.airline} ${flight.flightNumber}`;
  
  let startTimeUTC: string;
  let endTimeUTC: string;

  // For calendar event timing, use SCHEDULED times as per user preference.
  // Actual and Predicted times will be in the description.
  let eventDepartureTime = flight.departureTime; // Use scheduled departure
  let eventArrivalTime = flight.arrivalTime;     // Use scheduled arrival

  try {
    startTimeUTC = getUtcCalendarString(parseISO(eventDepartureTime));
    endTimeUTC = getUtcCalendarString(parseISO(eventArrivalTime));
  } catch (error) {
    console.error("Error parsing primary dates for Google Calendar link:", error);
    const now = new Date();
    startTimeUTC = getUtcCalendarString(now);
    endTimeUTC = getUtcCalendarString(new Date(now.getTime() + 60 * 60 * 1000)); 
  }

  const dates = `${startTimeUTC}/${endTimeUTC}`;
  
  const readableScheduledDeparture = formatToReadable(flight.departureTime);
  const readableScheduledArrival = formatToReadable(flight.arrivalTime);
  const readablePredictedArrival = formatToReadable(flight.predictedArrivalTime);
  const readableActualDeparture = formatToReadable(flight.actualDepartureTime);
  const readableActualArrival = formatToReadable(flight.actualArrivalTime);

  let descriptionLines = [
    `Flight: ${flight.airline} ${flight.flightNumber}` + (flight.aircraftModel ? ` (${flight.aircraftModel})` : ''),
    `Status: ${flight.status || 'N/A'}`,
  ];

  if (flight.codeshareStatus && flight.codeshareStatus !== "IsOperator" && flight.codeshareStatus !== "Unknown") {
    descriptionLines.push(`(${flight.codeshareStatus})`);
  }

  descriptionLines.push(
    `Origin: ${flight.origin}` +
    (flight.departureTerminal ? ` (Terminal ${flight.departureTerminal})` : '') +
    (flight.departureGate ? ` - Gate ${flight.departureGate}` : '')
  );
  descriptionLines.push(
    `Destination: ${flight.destination}` +
    (flight.arrivalTerminal ? ` (Terminal ${flight.arrivalTerminal})` : '') +
    (flight.arrivalGate ? ` - Gate ${flight.arrivalGate}` : '') +
    (flight.baggageBelt ? ` - Baggage ${flight.baggageBelt}` : '')
  );
  
  descriptionLines.push("---");

  if (readableActualDeparture) {
    descriptionLines.push(`Actual Departure: ${readableActualDeparture}`);
  } else if (readableScheduledDeparture) {
    descriptionLines.push(`Scheduled Departure: ${readableScheduledDeparture}`);
  }

  if (readableActualArrival) {
    descriptionLines.push(`Actual Arrival: ${readableActualArrival}`);
  } else {
    if (readableScheduledArrival) {
      descriptionLines.push(`Scheduled Arrival: ${readableScheduledArrival}`);
    }
    if (readablePredictedArrival && readablePredictedArrival !== readableScheduledArrival) {
      descriptionLines.push(`Predicted Arrival: ${readablePredictedArrival}`);
    }
  }
  
  const description = descriptionLines.join('\n');
  const location = flight.origin; // Keep location as origin IATA for better map integration

  const baseUrl = "https://calendar.google.com/calendar/render";
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: dates,
    details: description,
    location: location,
  });

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Generates an iCalendar (.ics) file content for the given flight information.
 * @param flight The flight information.
 * @returns A string containing the .ics file content, or null if an error occurs.
 */
export function generateIcsContent(flight: FlightInfo): string | null {
  const title = `Flight ${flight.airline} ${flight.flightNumber}`;

  // Reconstruct description similar to getGoogleCalendarLink for consistency
  const readableScheduledDeparture = formatToReadable(flight.departureTime);
  const readableScheduledArrival = formatToReadable(flight.arrivalTime);
  const readablePredictedArrival = formatToReadable(flight.predictedArrivalTime);
  const readableActualDeparture = formatToReadable(flight.actualDepartureTime);
  const readableActualArrival = formatToReadable(flight.actualArrivalTime);

  let descriptionLines = [
    `Flight: ${flight.airline} ${flight.flightNumber}` + (flight.aircraftModel ? ` (${flight.aircraftModel})` : ''),
    `Status: ${flight.status || 'N/A'}`,
  ];

  if (flight.codeshareStatus && flight.codeshareStatus !== "IsOperator" && flight.codeshareStatus !== "Unknown") {
    descriptionLines.push(`(${flight.codeshareStatus})`);
  }

  descriptionLines.push(
    `Origin: ${flight.origin}` +
    (flight.departureTerminal ? ` (Terminal ${flight.departureTerminal})` : '') +
    (flight.departureGate ? ` - Gate ${flight.departureGate}` : '')
  );
  descriptionLines.push(
    `Destination: ${flight.destination}` +
    (flight.arrivalTerminal ? ` (Terminal ${flight.arrivalTerminal})` : '') +
    (flight.arrivalGate ? ` - Gate ${flight.arrivalGate}` : '') +
    (flight.baggageBelt ? ` - Baggage ${flight.baggageBelt}` : '')
  );
  
  descriptionLines.push("---");

  if (readableActualDeparture) {
    descriptionLines.push(`Actual Departure: ${readableActualDeparture}`);
  } else if (readableScheduledDeparture) {
    descriptionLines.push(`Scheduled Departure: ${readableScheduledDeparture}`);
  }

  if (readableActualArrival) {
    descriptionLines.push(`Actual Arrival: ${readableActualArrival}`);
  } else {
    if (readableScheduledArrival) {
      descriptionLines.push(`Scheduled Arrival: ${readableScheduledArrival}`);
    }
    if (readablePredictedArrival && readablePredictedArrival !== readableScheduledArrival) {
      descriptionLines.push(`Predicted Arrival: ${readablePredictedArrival}`);
    }
  }

  // ICS spec requires literal \\n for newlines in description
  const description = descriptionLines.join('\n'); 

  try {
    // Use scheduled times for .ics, as per Google Calendar preference
    const startDateTime = parseISO(flight.departureTime);
    const endDateTime = parseISO(flight.arrivalTime);

    // The 'ics' library expects dates as [year, month, day, hour, minute]
    // These components should be based on UTC to avoid timezone issues in the .ics file itself.
    const startArray: ics.DateArray = [
      startDateTime.getUTCFullYear(),
      startDateTime.getUTCMonth() + 1, // Month is 1-indexed
      startDateTime.getUTCDate(),
      startDateTime.getUTCHours(),
      startDateTime.getUTCMinutes(),
    ];
    const endArray: ics.DateArray = [
      endDateTime.getUTCFullYear(),
      endDateTime.getUTCMonth() + 1, // Month is 1-indexed
      endDateTime.getUTCDate(),
      endDateTime.getUTCHours(),
      endDateTime.getUTCMinutes(),
    ];

    const event: ics.EventAttributes = {
      uid: `${flight.flightNumber}-${flight.departureTime}@flighttocalendar.com`, // Basic UID
      start: startArray,
      end: endArray,
      startInputType: 'utc', // Specify that input date arrays are UTC
      endInputType: 'utc',
      title: title,
      description: description, // Already formatted with \n
      location: flight.origin, // Use origin IATA code
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      // Optionally, add an alarm (e.g., 1 hour before departure)
      // alarms: [
      //   {
      //     action: 'display',
      //     description: 'Reminder',
      //     trigger: { hours: 1, before: true },
      //   },
      // ],
    };

    const { error, value } = ics.createEvent(event);
    if (error) {
      console.error("Error creating ICS event:", error);
      return null;
    }
    return value || null; // Ensure null is returned if value is undefined
  } catch (error) {
    console.error("Error generating ICS content:", error);
    return null;
  }
} 