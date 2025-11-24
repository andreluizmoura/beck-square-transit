import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface TransportCardProps {
  type: "bus" | "train";
  route: string;
  destination: string;
  arrivalTime: string;
  status?: "On time" | "Delayed" | "Cancelled";
  platform?: string;
}

export const TransportCard = ({
  type,
  route,
  destination,
  arrivalTime,
  status = "On time",
  platform,
}: TransportCardProps) => {
  const getStatusColor = () => {
    switch (status) {
      case "On time":
        return "bg-accent text-accent-foreground";
      case "Delayed":
        return "bg-destructive/20 text-destructive";
      case "Cancelled":
        return "bg-destructive text-destructive-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold text-primary">
              {route}
            </CardTitle>
            <p className="text-sm text-muted-foreground">{destination}</p>
          </div>
          <Badge className={getStatusColor()}>{status}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="text-lg font-semibold">{arrivalTime}</span>
          </div>
          {platform && (
            <div className="text-sm">
              <span className="text-muted-foreground">Platform </span>
              <span className="font-semibold">{platform}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
