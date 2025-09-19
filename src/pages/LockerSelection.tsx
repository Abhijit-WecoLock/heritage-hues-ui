import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus, CheckCircle, ArrowRight, ArrowLeft, Lock, MapPin, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";

interface LockerOption {
  duration: string;
  hours: number;
  multiplier: number;
  popular?: boolean;
}

interface LockerAssignment {
  section: string;
  lockerNumbers: number[];
  location: string;
  nearEntrance: string;
}

const lockerOptions: LockerOption[] = [
  { duration: "30 minutes", hours: 0.5, multiplier: 0.5 },
  { duration: "1 hour", hours: 1, multiplier: 1, popular: true },
  { duration: "2 hours", hours: 2, multiplier: 1.8 },
  { duration: "4 hours", hours: 4, multiplier: 3.2 },
  { duration: "Full day (8 hours)", hours: 8, multiplier: 5.0 }
];

const baseLockerPrice = 8; // $8 base price per locker

// Simulate AI locker assignment
const simulateLockerAssignment = (count: number): Promise<LockerAssignment> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sections = ["A", "B", "C", "D"];
      const locations = ["Main Hall", "East Wing", "West Wing", "North Gallery"];
      const entrances = ["Main Entrance", "East Wing Entrance", "West Wing Entrance", "North Gallery Entrance"];
      
      const sectionIndex = Math.floor(Math.random() * sections.length);
      const startLocker = Math.floor(Math.random() * 50) + 1;
      const lockerNumbers = Array.from({ length: count }, (_, i) => startLocker + i);
      
      resolve({
        section: sections[sectionIndex],
        lockerNumbers,
        location: locations[sectionIndex],
        nearEntrance: entrances[sectionIndex]
      });
    }, 1200); // Simulate AI processing time
  });
};

const LockerSelection = () => {
  const navigate = useNavigate();
  const [wantsLockers, setWantsLockers] = useState<boolean | null>(null);
  const [lockerCount, setLockerCount] = useState(1);
  const [selectedDuration, setSelectedDuration] = useState("1 hour");
  const [ticketData, setTicketData] = useState<any>(null);
  const [isAssigning, setIsAssigning] = useState(false);
  const [lockerAssignment, setLockerAssignment] = useState<LockerAssignment | null>(null);
  const [showAssignment, setShowAssignment] = useState(false);

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

  const handleLockerSelection = async (wants: boolean) => {
    setWantsLockers(wants);
    
    if (wants) {
      setIsAssigning(true);
      try {
        const assignment = await simulateLockerAssignment(lockerCount);
        setLockerAssignment(assignment);
        setShowAssignment(true);
        toast({
          title: "Lockers Reserved!",
          description: `${lockerCount} locker${lockerCount > 1 ? 's' : ''} assigned in Section ${assignment.section}`,
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Assignment Failed",
          description: "We couldn't assign lockers in your preferred zone. We've reserved alternative lockers for you.",
          variant: "destructive",
        });
      } finally {
        setIsAssigning(false);
      }
    }
  };

  const handleQuantityChange = async (newCount: number) => {
    setLockerCount(newCount);
    
    if (wantsLockers && newCount !== lockerCount) {
      setIsAssigning(true);
      setShowAssignment(false);
      try {
        const assignment = await simulateLockerAssignment(newCount);
        setLockerAssignment(assignment);
        setShowAssignment(true);
      } catch (error) {
        toast({
          title: "Reassignment Error",
          description: "Couldn't update locker assignment. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsAssigning(false);
      }
    }
  };

  const handleContinue = () => {
    const lockerSelection = wantsLockers ? {
      count: lockerCount,
      duration: selectedDuration,
      hours: getSelectedOption()?.hours || 0,
      price: getLockerPrice(),
      assignment: lockerAssignment
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
                    onClick={() => handleLockerSelection(true)}
                    className="heritage-button-primary flex-1"
                    disabled={isAssigning}
                  >
                    {isAssigning ? (
                      <>
                        <Zap className="mr-2 h-4 w-4 animate-spin" />
                        Assigning...
                      </>
                    ) : (
                      "Yes, Add Lockers"
                    )}
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={handleSkipLockers}
                    className="flex-1"
                    disabled={isAssigning}
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
                      onClick={() => handleQuantityChange(Math.max(1, lockerCount - 1))}
                      disabled={lockerCount <= 1 || isAssigning}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <div className="text-2xl font-bold px-6 animate-count-up">{lockerCount}</div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleQuantityChange(Math.min(6, lockerCount + 1))}
                      disabled={lockerCount >= 6 || isAssigning}
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

              {/* AI Locker Assignment Display */}
              {showAssignment && lockerAssignment && (
                <Card className="locker-assignment-card border-success">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-success/20 rounded-full p-2">
                        <CheckCircle className="h-6 w-6 text-success" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-success mb-2 flex items-center gap-2">
                          ✅ Lockers Reserved
                        </h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Section {lockerAssignment.section}</span>
                            <span className="text-muted-foreground">•</span>
                            <span>Locker{lockerAssignment.lockerNumbers.length > 1 ? 's' : ''} {lockerAssignment.lockerNumbers.join(', ')}</span>
                          </div>
                          <div className="text-muted-foreground">
                            Near {lockerAssignment.nearEntrance} • {lockerAssignment.location}
                          </div>
                          <div className="text-xs text-muted-foreground mt-2">
                            Locker codes will be delivered with your tickets
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Loading State */}
              {isAssigning && (
                <Card className="heritage-card">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3">
                      <Zap className="h-6 w-6 text-primary animate-spin" />
                      <div>
                        <p className="font-semibold">Finding optimal lockers...</p>
                        <p className="text-sm text-muted-foreground">AI is analyzing museum layout and traffic</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Price Preview */}
              {!isAssigning && wantsLockers && (
                <Card className="heritage-card">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-success" />
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
              )}
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