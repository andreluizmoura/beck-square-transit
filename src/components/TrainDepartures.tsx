import { TransportCard } from "./TransportCard";
import { Train } from "lucide-react";

interface TrainDeparture {
  route: string;
  destination: string;
  departureTime: string;
  platform: string;
  status: "On time" | "Delayed" | "Cancelled";
}

interface TrainDeparturesProps {
  stationName: string;
  departures: TrainDeparture[];
}

export const TrainDepartures = ({ stationName, departures }: TrainDeparturesProps) => {
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
        {departures.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No train departures available at the moment
          </div>
        ) : (
          departures.map((departure, index) => (
            <TransportCard
              key={`${departure.route}-${departure.destination}-${index}`}
              type="train"
              route={departure.route}
              destination={departure.destination}
              arrivalTime={departure.departureTime}
              status={departure.status}
              platform={departure.platform}
            />
          ))
        )}
      </div>
    </div>
  );
};
