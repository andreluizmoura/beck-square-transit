import { BusArrivals } from "@/components/BusArrivals";
import { TrainArrivals } from "@/components/TrainArrivals";
import { Separator } from "@/components/ui/separator";
import { MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { toast } from "sonner";

const Index = () => {
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const perthRoadArrivals = [
    { route: "48", destination: "Walthamstow Central", arrivalTime: "2 min", status: "On time" as const },
    { route: "56", destination: "Hackney Central", arrivalTime: "5 min", status: "On time" as const },
    { route: "48", destination: "London Bridge", arrivalTime: "8 min", status: "On time" as const },
    { route: "488", destination: "Bromley-by-Bow", arrivalTime: "12 min", status: "Delayed" as const },
  ];

  const leaBridgeBusArrivals = [
    { route: "56", destination: "Hackney Central", arrivalTime: "3 min", status: "On time" as const },
    { route: "W15", destination: "Hackney Wick", arrivalTime: "7 min", status: "On time" as const },
    { route: "W15", destination: "Chingford Station", arrivalTime: "15 min", status: "On time" as const },
  ];

  const leaBridgeTrainArrivals = [
    { route: "Liverpool St", destination: "Liverpool Street", arrivalTime: "4 min", platform: "1", status: "On time" as const },
    { route: "Stratford", destination: "Stratford", arrivalTime: "9 min", platform: "2", status: "On time" as const },
    { route: "Chingford", destination: "Chingford", arrivalTime: "14 min", platform: "1", status: "On time" as const },
    { route: "Liverpool St", destination: "Liverpool Street", arrivalTime: "19 min", platform: "1", status: "On time" as const },
  ];

  const handleRefresh = () => {
    setLastUpdated(new Date());
    toast.success("Transport information updated");
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Auto-refresh every 30 seconds

    return () => clearInterval(interval);
  }, []);

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
        <div className="space-y-8">
          {/* Bus Stops Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-primary">Bus Arrivals</span>
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <BusArrivals stopName="Perth Road" arrivals={perthRoadArrivals} />
              <BusArrivals stopName="Lea Bridge Station" arrivals={leaBridgeBusArrivals} />
            </div>
          </section>

          <Separator className="my-8" />

          {/* Train Station Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-secondary">Train Arrivals</span>
            </h2>
            <TrainArrivals stationName="Lea Bridge Station" arrivals={leaBridgeTrainArrivals} />
          </section>
        </div>
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
