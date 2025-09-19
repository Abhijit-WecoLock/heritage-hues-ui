import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Minus, Plus, Clock, Users, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";

interface TicketType {
  id: string;
  name: string;
  price: number;
  description: string;
  ageGroup?: string;
}

interface TimeSlot {
  id: string;
  time: string;
  available: number;
  price: number;
}

const ticketTypes: TicketType[] = [
  { id: "adult", name: "Adult", price: 25, description: "Ages 18-64", ageGroup: "18-64 years" },
  { id: "senior", name: "Senior", price: 20, description: "Ages 65+", ageGroup: "65+ years" },
  { id: "student", name: "Student", price: 18, description: "With valid ID", ageGroup: "With student ID" },
  { id: "child", name: "Child", price: 12, description: "Ages 5-17", ageGroup: "5-17 years" },
  { id: "family", name: "Family Pass", price: 65, description: "2 Adults + 2 Children" }
];

const timeSlots: TimeSlot[] = [
  { id: "09:00", time: "9:00 AM", available: 45, price: 0 },
  { id: "10:30", time: "10:30 AM", available: 32, price: 0 },
  { id: "12:00", time: "12:00 PM", available: 28, price: 5 }, // Premium time
  { id: "13:30", time: "1:30 PM", available: 38, price: 5 },
  { id: "15:00", time: "3:00 PM", available: 42, price: 0 },
  { id: "16:30", time: "4:30 PM", available: 15, price: 0 }
];

const TicketSelection = () => {
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");
  const [ticketQuantities, setTicketQuantities] = useState<{ [key: string]: number }>({});
  const [showOffers, setShowOffers] = useState(false);
  
  const updateQuantity = (ticketId: string, delta: number) => {
    setTicketQuantities(prev => ({
      ...prev,
      [ticketId]: Math.max(0, (prev[ticketId] || 0) + delta)
    }));
  };

  const getTotalTickets = () => {
    return Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalPrice = () => {
    const ticketTotal = Object.entries(ticketQuantities).reduce((sum, [ticketId, qty]) => {
      const ticket = ticketTypes.find(t => t.id === ticketId);
      return sum + (ticket?.price || 0) * qty;
    }, 0);
    
    const timeSlotPrice = timeSlots.find(t => t.id === selectedTimeSlot)?.price || 0;
    const timeSlotTotal = timeSlotPrice * getTotalTickets();
    
    return ticketTotal + timeSlotTotal;
  };

  const handleContinue = () => {
    if (!selectedDate || !selectedTimeSlot || getTotalTickets() === 0) {
      toast({
        title: "Incomplete Selection",
        description: "Please select a date, time slot, and at least one ticket.",
        variant: "destructive",
      });
      return;
    }

    // Store selection in sessionStorage for the next step
    sessionStorage.setItem('ticketSelection', JSON.stringify({
      date: selectedDate,
      timeSlot: selectedTimeSlot,
      tickets: ticketQuantities,
      total: getTotalPrice()
    }));

    navigate('/locker-selection');
  };

  const canSelectDate = (date: Date) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return date >= today && date <= maxDate;
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Select Your Visit</h1>
            <p className="text-muted-foreground">Choose your preferred date, time, and tickets</p>
          </div>

          <div className="heritage-grid">
            {/* Left Column - Date & Time Selection */}
            <div className="md:col-span-8 space-y-6">
              {/* Date Selection */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Select Date
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    disabled={(date) => !canSelectDate(date)}
                    className="rounded-md border"
                  />
                </CardContent>
              </Card>

              {/* Time Slot Selection */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Available Time Slots</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {timeSlots.map((slot) => (
                      <Button
                        key={slot.id}
                        variant={selectedTimeSlot === slot.id ? "default" : "outline"}
                        className={`p-4 h-auto flex-col ${
                          selectedTimeSlot === slot.id ? "heritage-button-primary" : ""
                        }`}
                        onClick={() => setSelectedTimeSlot(slot.id)}
                      >
                        <div className="font-semibold">{slot.time}</div>
                        <div className="text-xs opacity-75">{slot.available} spots left</div>
                        {slot.price > 0 && (
                          <Badge variant="secondary" className="mt-1">+${slot.price}</Badge>
                        )}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ticket Type Selection */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Select Tickets
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ticketTypes.map((ticket) => (
                      <div key={ticket.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <h3 className="font-semibold">{ticket.name}</h3>
                          <p className="text-sm text-muted-foreground">{ticket.description}</p>
                          {ticket.ageGroup && (
                            <Badge variant="outline" className="mt-1">{ticket.ageGroup}</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-lg font-bold">${ticket.price}</div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(ticket.id, -1)}
                              disabled={(ticketQuantities[ticket.id] || 0) === 0}
                            >
                              <Minus className="h-4 w-4" />
                            </Button>
                            <span className="w-8 text-center font-semibold">
                              {ticketQuantities[ticket.id] || 0}
                            </span>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateQuantity(ticket.id, 1)}
                            >
                              <Plus className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Sticky Summary */}
            <div className="md:col-span-4">
              <Card className="heritage-card sticky top-24">
                <CardHeader>
                  <CardTitle>Booking Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {selectedDate && (
                    <div>
                      <p className="font-semibold">Visit Date</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedDate.toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </p>
                    </div>
                  )}
                  
                  {selectedTimeSlot && (
                    <div>
                      <p className="font-semibold">Time Slot</p>
                      <p className="text-sm text-muted-foreground">
                        {timeSlots.find(t => t.id === selectedTimeSlot)?.time}
                      </p>
                    </div>
                  )}

                  {getTotalTickets() > 0 && (
                    <div>
                      <p className="font-semibold mb-2">Tickets ({getTotalTickets()})</p>
                      {Object.entries(ticketQuantities)
                        .filter(([_, qty]) => qty > 0)
                        .map(([ticketId, qty]) => {
                          const ticket = ticketTypes.find(t => t.id === ticketId);
                          return (
                            <div key={ticketId} className="flex justify-between text-sm">
                              <span>{qty}x {ticket?.name}</span>
                              <span>${(ticket?.price || 0) * qty}</span>
                            </div>
                          );
                        })}
                    </div>
                  )}

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total</span>
                      <span>${getTotalPrice()}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full heritage-button-primary"
                    onClick={handleContinue}
                    disabled={!selectedDate || !selectedTimeSlot || getTotalTickets() === 0}
                  >
                    Continue to Lockers
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default TicketSelection;