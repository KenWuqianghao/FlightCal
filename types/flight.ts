export interface FlightInfo {
  airline: string;
  flightNumber: string;
  departureTime: string; // ISO string (UTC) - Scheduled
  arrivalTime: string;   // ISO string (UTC) - Scheduled (as per user preference)
  origin: string;        // IATA code
  destination: string;   // IATA code
  departureTerminal?: string;
  arrivalTerminal?: string;
  predictedArrivalTime?: string; // ISO string (UTC) - Predicted
  status?: string;
  departureGate?: string;
  arrivalGate?: string;
  baggageBelt?: string;
  aircraftModel?: string;
  actualDepartureTime?: string;  // ISO string (UTC) - Actual
  actualArrivalTime?: string;    // ISO string (UTC) - Actual
  codeshareStatus?: string;
  originMunicipalityName?: string;
  destinationMunicipalityName?: string;
  airlineIata?: string; // For fetching logo
} 