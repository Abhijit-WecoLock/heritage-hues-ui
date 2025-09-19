import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, CheckCircle, ArrowRight, ArrowLeft, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";

interface LockerOption {
  duration: string;
  hours: number;
  multiplier: number;
  popular?: boolean;
}

const lockerOptions: LockerOption[] = [
  { duration: "30 minutes", hours: 0.5, multiplier: 0.5 },
  { duration: "1 hour", hours: 1, multiplier: 1, popular: true },
  { duration: "2 hours", hours: 2, multiplier: 1.8 },
  { duration: "4 hours", hours: 4, multiplier: 3.2 },
  { duration: "Full day (8 hours)", hours: 8, multiplier: 5.0 }
];

const baseLockerPrice = 8; // $8 base price per locker

const LockerSelection = () => {
  const navigate = useNavigate();
  const [wantsLockers, setWantsLockers] = useState<boolean | null>(null);
  const [lockerCount, setLockerCount] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState("1 hour");
  const [ticketData, setTicketData] = useState<any>(null);

  useEffect(() => {
    // Load ticket selection data
    const stored = sessionStorage.getItem('ticketSelection');
    if (stored) {
      setTicketData(JSON.parse(stored));
    } else {
      navigate('/tickets'); // Redirect if no ticket data
    }
  }, [navigate]);

  const getSelectedOption = () => {
    return lockerOptions.find(option => option.duration === selectedDuration);
  };

  const getLockerPrice = () => {
    const option = getSelectedOption();
    if (!option) return 0;
    return Math.round(baseLockerPrice * option.multiplier * lockerCount);
  };

  const getTotalPrice = () => {
    const ticketTotal = ticketData?.total || 0;
    const lockerTotal = wantsLockers ? getLockerPrice() : 0;
    return ticketTotal + lockerTotal;
  };

  const handleContinue = () => {
    const lockerSelection = wantsLockers ? {
      count: lockerCount,
      duration: selectedDuration,
      hours: getSelectedOption()?.hours || 0,
      price: getLockerPrice()
    } : null;

    // Store combined selection
    sessionStorage.setItem('bookingData', JSON.stringify({
      tickets: ticketData,
      lockers: lockerSelection,
      total: getTotalPrice()
    }));

    navigate('/summary');
  };

  const handleSkipLockers = () => {
    setWantsLockers(false);
  };

  if (!ticketData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Secure Storage</h1>
            <p className="text-muted-foreground">Reserve lockers for a hands-free visit</p>
          </div>

          {/* Initial Prompt */}
          {wantsLockers === null && (
            <Card className="heritage-card animate-fade-up">
              <CardContent className="p-8 text-center">
                <div className="mb-6">
                  <Lock className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold mb-2">Reserve lockers for faster check-in?</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Skip the lines and enjoy your visit with secure storage for your belongings. 
                    Locker codes will be delivered with your tickets.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-sm mx-auto">
                  <Button 
                    onClick={() => setWantsLockers(true)}
                    className="heritage-button-primary flex-1"
                  >
                    Yes, Add Lockers
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleSkipLockers}
                    className="flex-1"
                  >
                    No Thanks
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Locker Configuration */}
          {wantsLockers === true && (
            <div className="space-y-6 animate-fade-up">
              {/* Number of Lockers */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Number of Lockers</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Each locker fits 2-3 bags or personal items
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between max-w-xs">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setLockerCount(Math.max(1, lockerCount - 1))}
                      disabled={lockerCount <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="text-2xl font-bold px-6">{lockerCount}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setLockerCount(Math.min(6, lockerCount + 1))}
                      disabled={lockerCount >= 6}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Maximum 6 lockers per booking</p>
                </CardContent>
              </Card>

              {/* Duration Selection */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Storage Duration</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lockerOptions.map((option) => (
                      <Button
                        key={option.duration}
                        variant={selectedDuration === option.duration ? "default" : "outline"}
                        className={`p-4 h-auto flex-col relative ${
                          selectedDuration === option.duration ? "heritage-button-primary" : ""
                        }`}
                        onClick={() => setSelectedDuration(option.duration)}
                      >
                        {option.popular && (
                          <Badge className="absolute -top-2 -right-2 bg-secondary text-secondary-foreground">
                            Popular
                          </Badge>
                        )}
                        <div className="font-semibold">{option.duration}</div>
                        <div className="text-xs opacity-75 mt-1">
                          ${Math.round(baseLockerPrice * option.multiplier)} per locker
                        </div>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Price Preview */}
              <Card className="heritage-card">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <div className="flex-1">
                      <p className="font-semibold">
                        {lockerCount} locker{lockerCount > 1 ? 's' : ''} reserved for your visit
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDuration} • ${getLockerPrice()} total
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Summary & Continue */}
          {wantsLockers !== null && (
            <Card className="heritage-card mt-6">
              <CardHeader>
                <CardTitle>Booking Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Museum tickets</span>
                  <span>${ticketData.total}</span>
                </div>
                
                {wantsLockers && (
                  <div className="flex justify-between">
                    <span>Locker storage ({lockerCount}x {selectedDuration})</span>
                    <span>${getLockerPrice()}</span>
                  </div>
                )}
                
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${getTotalPrice()}</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/tickets')}
                    className="flex-1"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Tickets
                  </Button>
                  <Button 
                    onClick={handleContinue}
                    className="flex-1 heritage-button-primary"
                  >
                    Continue to Summary
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

export default LockerSelection;