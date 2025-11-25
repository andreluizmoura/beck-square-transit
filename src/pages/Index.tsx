import { BusArrivals } from "@/components/BusArrivals";
import { TrainDepartures } from "@/components/TrainDepartures";
import { Separator } from "@/components/ui/separator";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { fetchBusArrivals, fetchTrainDepartures, STOP_IDS, BusArrival, TrainDeparture } from "@/services/tflApi";

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(true);
  const [leaBridgeRoundaboutArrivals, setLeaBridgeRoundaboutArrivals] = useState<BusArrival[]>([]);
  const [leaBridgeBusArrivals, setLeaBridgeBusArrivals] = useState<BusArrival[]>([]);
  const [leaBridgeTrainDepartures, setLeaBridgeTrainDepartures] = useState<TrainDeparture[]>([]);

  const fetchAllArrivals = useCallback(async () => {
    try {
      setIsLoading(true);
      const [roundaboutBuses, leaBridgeBuses, leaBridgeTrains] = await Promise.all([
        fetchBusArrivals(STOP_IDS.LEA_BRIDGE_ROUNDABOUT),
        fetchBusArrivals(STOP_IDS.LEA_BRIDGE_STATION_BUS),
        fetchTrainDepartures(),
      ]);

      setLeaBridgeRoundaboutArrivals(roundaboutBuses);
      setLeaBridgeBusArrivals(leaBridgeBuses);
      setLeaBridgeTrainDepartures(leaBridgeTrains);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error("Failed to fetch transport data. Please try again.");
      console.error("Error fetching transport data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleRefresh = () => {
    fetchAllArrivals();
    toast.success("Refreshing transport information...");
  };

  useEffect(() => {
    fetchAllArrivals();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchAllArrivals();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchAllArrivals]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-7 w-7 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Beck Square Transport</h1>
                <p className="text-sm text-muted-foreground">
                  Last updated: {lastUpdated.toLocaleTimeString('en-GB')}
                </p>
              </div>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="icon">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {isLoading && leaBridgeRoundaboutArrivals.length === 0 ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto" />
              <p className="text-lg text-muted-foreground">Loading transport data...</p>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Bus Stops Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-primary">Bus Arrivals</span>
              </h2>
              <div className="grid md:grid-cols-2 gap-6">
                <BusArrivals stopName="Perth Road" arrivals={leaBridgeRoundaboutArrivals} />
                <BusArrivals stopName="Lea Bridge Station" arrivals={leaBridgeBusArrivals} />
              </div>
            </section>

            <Separator className="my-8" />

            {/* Train Station Section */}
            <section>
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <span className="text-secondary">Train Departures</span>
              </h2>
              <TrainDepartures stationName="Lea Bridge Station" departures={leaBridgeTrainDepartures} />
            </section>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t bg-card mt-12">
        <div className="container mx-auto px-4 py-6 text-centre text-sm text-muted-foreground">
          <p>Transport information is updated every 30 seconds</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
