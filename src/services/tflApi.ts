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

export interface TrainDeparture {
  route: string;
  destination: string;
  departureTime: string;
  platform: string;
  status: "On time" | "Delayed" | "Cancelled";
}

// National Rail API via Huxley 2
const HUXLEY_API_BASE = "https://huxley2.azurewebsites.net";

interface HuxleyService {
  destination?: Array<{ locationName: string }>;
  std?: string; // Scheduled time of departure
  etd?: string; // Estimated time of departure
  platform?: string;
  operator?: string;
  isCancelled?: boolean;
}

interface HuxleyResponse {
  trainServices?: HuxleyService[];
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

export const fetchTrainDepartures = async (): Promise<TrainDeparture[]> => {
  try {
    // Using Huxley 2 API for National Rail (Lea Bridge = LEB)
    const url = `${HUXLEY_API_BASE}/departures/LEB/4?expand=true`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`National Rail API error: ${response.status}`);
    }
    
    const data: HuxleyResponse = await response.json();
    
    if (!data.trainServices || data.trainServices.length === 0) {
      return [];
    }
    
    return data.trainServices.slice(0, 4).map((service) => {
      const destination = service.destination?.[0]?.locationName || "Unknown";
      const scheduled = service.std || "TBA";
      const estimated = service.etd || scheduled;
      const isCancelled = service.isCancelled || false;
      const isDelayed = estimated !== scheduled && estimated !== "On time";
      
      let status: "On time" | "Delayed" | "Cancelled" = "On time";
      if (isCancelled) {
        status = "Cancelled";
      } else if (isDelayed && estimated !== "Delayed") {
        status = "Delayed";
      }
      
      return {
        route: service.operator || "National Rail",
        destination,
        departureTime: estimated === "On time" ? scheduled : estimated,
        platform: service.platform || "TBA",
        status,
      };
    });
  } catch (error) {
    console.error("Error fetching train departures:", error);
    throw error;
  }
};
