// TfL API Service
// API Documentation: https://api.tfl.gov.uk/
// You can optionally add an API key for higher rate limits at: https://api-portal.tfl.gov.uk/

const TFL_API_BASE = "https://api.tfl.gov.uk";

// Optional: Add your TfL API credentials here for higher rate limits
// Get free API keys at: https://api-portal.tfl.gov.uk/
const TFL_APP_ID = ""; // Leave empty to use without authentication
const TFL_APP_KEY = ""; // Leave empty to use without authentication

// Stop IDs for Beck Square area in Leyton
export const STOP_IDS = {
  LEA_BRIDGE_ROUNDABOUT: "490010956E",
  LEA_BRIDGE_STATION_BUS: "490011583W",
  LEA_BRIDGE_STATION_RAIL: "910GLEABDGE",
};

interface TflArrival {
  id: string;
  lineName: string;
  destinationName: string;
  timeToStation: number;
  expectedArrival: string;
  platformName?: string;
  currentLocation?: string;
}

export interface BusArrival {
  route: string;
  destination: string;
  arrivalTime: string;
  status: "On time" | "Delayed" | "Cancelled";
}

export interface TrainArrival {
  route: string;
  destination: string;
  arrivalTime: string;
  platform: string;
  status: "On time" | "Delayed" | "Cancelled";
}

const buildUrl = (endpoint: string): string => {
  const url = new URL(endpoint, TFL_API_BASE);
  if (TFL_APP_ID && TFL_APP_KEY) {
    url.searchParams.append("app_id", TFL_APP_ID);
    url.searchParams.append("app_key", TFL_APP_KEY);
  }
  return url.toString();
};

const formatArrivalTime = (timeToStation: number): string => {
  const minutes = Math.floor(timeToStation / 60);
  if (minutes < 1) return "Due";
  if (minutes === 1) return "1 min";
  return `${minutes} mins`;
};

const determineStatus = (timeToStation: number): "On time" | "Delayed" => {
  // This is a simplified status - TfL doesn't always provide delay information
  // In a production app, you might want to compare with scheduled times
  return "On time";
};

export const fetchBusArrivals = async (stopId: string): Promise<BusArrival[]> => {
  try {
    const url = buildUrl(`/StopPoint/${stopId}/Arrivals`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TfL API error: ${response.status}`);
    }
    
    const data: TflArrival[] = await response.json();
    
    // Sort by arrival time and take the next few arrivals
    const sortedArrivals = data
      .sort((a, b) => a.timeToStation - b.timeToStation)
      .slice(0, 10);
    
    return sortedArrivals.map((arrival) => ({
      route: arrival.lineName,
      destination: arrival.destinationName,
      arrivalTime: formatArrivalTime(arrival.timeToStation),
      status: determineStatus(arrival.timeToStation),
    }));
  } catch (error) {
    console.error(`Error fetching bus arrivals for stop ${stopId}:`, error);
    throw error;
  }
};

export const fetchTrainArrivals = async (stationId: string): Promise<TrainArrival[]> => {
  try {
    const url = buildUrl(`/StopPoint/${stationId}/Arrivals`);
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`TfL API error: ${response.status}`);
    }
    
    const data: TflArrival[] = await response.json();
    
    // Sort by arrival time and take the next 4 trains
    const sortedArrivals = data
      .sort((a, b) => a.timeToStation - b.timeToStation)
      .slice(0, 4);
    
    return sortedArrivals.map((arrival) => ({
      route: arrival.lineName,
      destination: arrival.destinationName,
      arrivalTime: formatArrivalTime(arrival.timeToStation),
      platform: arrival.platformName || "TBA",
      status: determineStatus(arrival.timeToStation),
    }));
  } catch (error) {
    console.error(`Error fetching train arrivals for station ${stationId}:`, error);
    throw error;
  }
};
