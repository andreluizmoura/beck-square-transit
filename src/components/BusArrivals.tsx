import { TransportCard } from "./TransportCard";
import { Bus } from "lucide-react";

interface BusArrival {
  route: string;
  destination: string;
  arrivalTime: string;
  status: "On time" | "Delayed" | "Cancelled";
}

interface BusArrivalsProps {
  stopName: string;
  arrivals: BusArrival[];
}

export const BusArrivals = ({ stopName, arrivals }: BusArrivalsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Bus className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{stopName}</h2>
          <p className="text-sm text-muted-foreground">Bus Stop</p>
        </div>
      </div>
      <div className="grid gap-3">
        {arrivals.map((arrival, index) => (
          <TransportCard
            key={index}
            type="bus"
            route={arrival.route}
            destination={arrival.destination}
            arrivalTime={arrival.arrivalTime}
            status={arrival.status}
          />
        ))}
      </div>
    </div>
  );
};
