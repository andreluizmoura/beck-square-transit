import { TransportCard } from "./TransportCard";
import { Train } from "lucide-react";

interface TrainArrival {
  route: string;
  destination: string;
  arrivalTime: string;
  platform: string;
  status: "On time" | "Delayed" | "Cancelled";
}

interface TrainArrivalsProps {
  stationName: string;
  arrivals: TrainArrival[];
}

export const TrainArrivals = ({ stationName, arrivals }: TrainArrivalsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-secondary/10 rounded-lg">
          <Train className="h-6 w-6 text-secondary" />
        </div>
        <div>
          <h2 className="text-2xl font-bold">{stationName}</h2>
          <p className="text-sm text-muted-foreground">Railway Station</p>
        </div>
      </div>
      <div className="grid gap-3">
        {arrivals.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No train arrivals available at the moment
          </div>
        ) : (
          arrivals.map((arrival, index) => (
            <TransportCard
              key={`${arrival.route}-${arrival.destination}-${index}`}
              type="train"
              route={arrival.route}
              destination={arrival.destination}
              arrivalTime={arrival.arrivalTime}
              status={arrival.status}
              platform={arrival.platform}
            />
          ))
        )}
      </div>
    </div>
  );
};
