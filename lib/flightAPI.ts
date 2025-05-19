import { FlightInfo } from '../types/flight';

export async function getFlightInfo(
  flightNumber: string,
  date: string, // Expected format YYYY-MM-DD
  apiKey: string
): Promise<FlightInfo> {
  const baseUrl = `https://aerodatabox.p.rapidapi.com/flights/number/${flightNumber}/${date}`;
  const params = new URLSearchParams({
    withAircraftImage: 'false',
    withLocation: 'false',
    dateLocalRole: 'Both' 
  });
  const url = `${baseUrl}?${params.toString()}`;
  
  console.log(`Fetching real flight info from: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com'
      }
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error('API Error Response:', response.status, errorBody);
      throw new Error(`API request failed with status ${response.status}: ${response.statusText}. Check console for details.`);
    }

    const data = await response.json();
    console.log('Raw API Response:', JSON.stringify(data, null, 2));

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error('No flight data returned or unexpected format from API.');
    }

    const flightData = data[0]; // We primarily use the first flight record (operating carrier)

    // Core validation
    if (
      !flightData.airline?.name ||
      !flightData.number ||
      !flightData.departure?.airport?.iata ||
      !flightData.departure?.scheduledTime?.utc ||
      !flightData.arrival?.airport?.iata ||
      !flightData.arrival?.scheduledTime?.utc
    ) {
        console.error("Core flight data fields missing in API response:", flightData);
        throw new Error("Core flight data fields missing in API response. Check console.");
    }
    
    const transformedData: FlightInfo = {
      // Core fields
      airline: flightData.airline.name,
      flightNumber: flightData.number,
      departureTime: flightData.departure.scheduledTime.utc,
      arrivalTime: flightData.arrival.scheduledTime.utc, 
      origin: flightData.departure.airport.iata,
      destination: flightData.arrival.airport.iata,
      
      // Optional fields from previous updates
      departureTerminal: flightData.departure?.terminal,
      arrivalTerminal: flightData.arrival?.terminal,
      predictedArrivalTime: flightData.arrival?.predictedTime?.utc,

      // Newly added optional fields
      status: flightData.status,
      departureGate: flightData.departure?.gate,
      arrivalGate: flightData.arrival?.gate,
      baggageBelt: flightData.arrival?.baggageBelt,
      aircraftModel: flightData.aircraft?.model,
      actualDepartureTime: flightData.departure?.actualTimeUtc ?? flightData.departure?.actualTime?.utc, // Handle both possible structures for actualTimeUtc
      actualArrivalTime: flightData.arrival?.actualTimeUtc ?? flightData.arrival?.actualTime?.utc,     // Handle both possible structures for actualTimeUtc
      codeshareStatus: flightData.codeshareStatus,

      // New fields for FlightCard
      originMunicipalityName: flightData.departure?.airport?.municipalityName,
      destinationMunicipalityName: flightData.arrival?.airport?.municipalityName,
      airlineIata: flightData.airline?.iata,
    };

    console.log('Transformed Flight Info:', transformedData);
    return transformedData;

  } catch (error) {
    console.error('Error fetching flight information:', error);
    if (error instanceof Error) {
        throw new Error(`Failed to fetch flight data: ${error.message}`);
    }
    throw new Error('An unknown error occurred while fetching flight data.');
  }
} 