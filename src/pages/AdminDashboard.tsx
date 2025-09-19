import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from "recharts";
import { 
  MapPin, 
  AlertTriangle, 
  Settings, 
  TrendingUp, 
  Users,
  Lock,
  Wifi,
  WifiOff,
  Clock,
  CheckCircle,
  XCircle
} from "lucide-react";
import Header from "@/components/layout/Header";

interface LockerZone {
  id: string;
  name: string;
  total: number;
  occupied: number;
  offline: number;
  status: 'normal' | 'high' | 'critical';
}

interface PredictionData {
  time: string;
  predicted: number;
  actual: number;
}

const AdminDashboard = () => {
  const [selectedZone, setSelectedZone] = useState<string | null>(null);

  // Mock data for locker zones
  const lockerZones: LockerZone[] = [
    { id: 'A', name: 'Section A - Main Hall', total: 48, occupied: 32, offline: 2, status: 'high' },
    { id: 'B', name: 'Section B - East Wing', total: 36, occupied: 18, offline: 0, status: 'normal' },
    { id: 'C', name: 'Section C - West Wing', total: 42, occupied: 38, offline: 1, status: 'critical' },
    { id: 'D', name: 'Section D - North Gallery', total: 30, occupied: 12, offline: 0, status: 'normal' },
  ];

  // Mock occupancy prediction data
  const predictionData: PredictionData[] = [
    { time: '9:00', predicted: 25, actual: 22 },
    { time: '10:00', predicted: 45, actual: 48 },
    { time: '11:00', predicted: 65, actual: 62 },
    { time: '12:00', predicted: 85, actual: 89 },
    { time: '13:00', predicted: 75, actual: 71 },
    { time: '14:00', predicted: 82, actual: 85 },
    { time: '15:00', predicted: 68, actual: 65 },
    { time: '16:00', predicted: 45, actual: 43 },
  ];

  const getOccupancyPercentage = (zone: LockerZone) => {
    return Math.round((zone.occupied / (zone.total - zone.offline)) * 100);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'high': return 'text-orange-600 bg-orange-50 border-orange-200';
      default: return 'text-green-600 bg-green-50 border-green-200';
    }
  };

  const HeatmapCell = ({ zone }: { zone: LockerZone }) => {
    const percentage = getOccupancyPercentage(zone);
    let bgColor = 'bg-green-100 hover:bg-green-200';
    
    if (percentage >= 80) bgColor = 'bg-red-100 hover:bg-red-200';
    else if (percentage >= 60) bgColor = 'bg-orange-100 hover:bg-orange-200';
    else if (percentage >= 40) bgColor = 'bg-yellow-100 hover:bg-yellow-200';

    return (
      <div 
        className={`p-4 rounded-lg border cursor-pointer transition-colors ${bgColor}`}
        onClick={() => setSelectedZone(zone.id)}
      >
        <div className="text-sm font-medium">Section {zone.id}</div>
        <div className="text-2xl font-bold">{percentage}%</div>
        <div className="text-xs text-muted-foreground">
          {zone.occupied}/{zone.total - zone.offline}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">Real-time locker management and analytics</p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="heritage-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-primary/10 rounded-full p-3">
                  <Lock className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">156</p>
                  <p className="text-sm text-muted-foreground">Total Lockers</p>
                </div>
              </CardContent>
            </Card>

            <Card className="heritage-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-success/10 rounded-full p-3">
                  <Users className="h-6 w-6 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">100</p>
                  <p className="text-sm text-muted-foreground">Currently Occupied</p>
                </div>
              </CardContent>
            </Card>

            <Card className="heritage-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-orange-100 rounded-full p-3">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">64%</p>
                  <p className="text-sm text-muted-foreground">Utilization Rate</p>
                </div>
              </CardContent>
            </Card>

            <Card className="heritage-card">
              <CardContent className="p-6 flex items-center gap-4">
                <div className="bg-red-100 rounded-full p-3">
                  <WifiOff className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">3</p>
                  <p className="text-sm text-muted-foreground">Offline Lockers</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Occupancy Heatmap */}
            <Card className="heritage-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  Zone Occupancy Heatmap
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {lockerZones.map((zone) => (
                    <HeatmapCell key={zone.id} zone={zone} />
                  ))}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 rounded"></div>
                    <span>Low (0-40%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-yellow-100 rounded"></div>
                    <span>Medium (40-60%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-orange-100 rounded"></div>
                    <span>High (60-80%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-100 rounded"></div>
                    <span>Critical (80%+)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Zone Status */}
            <Card className="heritage-card">
              <CardHeader>
                <CardTitle>Zone Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lockerZones.map((zone) => (
                    <div key={zone.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="font-medium">Section {zone.id}</div>
                        <Badge className={getStatusColor(zone.status)}>
                          {zone.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span>{zone.total - zone.occupied - zone.offline}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span>{zone.occupied}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span>{zone.offline}</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline">
                              <Settings className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Manage {zone.name}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label>Override Locker</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select locker" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {Array.from({ length: zone.total }, (_, i) => (
                                        <SelectItem key={i} value={`${zone.id}-${i + 1}`}>
                                          Locker {zone.id}-{i + 1}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label>Action</Label>
                                  <Select>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select action" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="unlock">Force Unlock</SelectItem>
                                      <SelectItem value="lock">Force Lock</SelectItem>
                                      <SelectItem value="offline">Mark Offline</SelectItem>
                                      <SelectItem value="reset">Reset</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button className="heritage-button-primary flex-1">
                                  Apply Override
                                </Button>
                                <Button variant="outline" className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Predictive Analytics */}
            <Card className="heritage-card lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Occupancy Prediction vs Actual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={predictionData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="predicted" 
                      stroke="hsl(var(--heritage-coral))" 
                      strokeWidth={2}
                      name="AI Prediction"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="actual" 
                      stroke="hsl(var(--heritage-sage))" 
                      strokeWidth={2}
                      name="Actual Usage"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Model Diagnostics */}
            <Card className="heritage-card lg:col-span-2">
              <CardHeader>
                <CardTitle>AI Model Diagnostics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="font-medium">Model Version</span>
                    </div>
                    <p className="text-2xl font-bold">v2.1.3</p>
                    <p className="text-sm text-muted-foreground">Last updated: 2 hours ago</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium">Average Confidence</span>
                    </div>
                    <p className="text-2xl font-bold">94.7%</p>
                    <p className="text-sm text-muted-foreground">Based on last 1000 predictions</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="font-medium">Drift Warnings</span>
                    </div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">No recent anomalies detected</p>
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">System Status: Healthy</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All AI prediction models are operating within normal parameters. 
                    Last health check completed 5 minutes ago.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;