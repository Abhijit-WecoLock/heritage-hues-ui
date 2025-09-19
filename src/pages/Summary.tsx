import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Edit2, ArrowRight, ArrowLeft, Trash2, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";

const Summary = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingData');
    if (stored) {
      setBookingData(JSON.parse(stored));
    } else {
      navigate('/tickets');
    }
  }, [navigate]);

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTicketTypeLabel = (ticketId: string) => {
    const labels: { [key: string]: string } = {
      adult: "Adult",
      senior: "Senior",
      student: "Student",
      child: "Child",
      family: "Family Pass"
    };
    return labels[ticketId] || ticketId;
  };

  const handleEditTickets = () => {
    toast({
      title: "Edit Tickets",
      description: "Redirecting to ticket selection...",
    });
    navigate('/tickets');
  };

  const handleEditLockers = () => {
    toast({
      title: "Edit Lockers",
      description: "Redirecting to locker selection...",
    });
    navigate('/locker-selection');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading your booking...</p>
        </div>
      </div>
    );
  }

  const { tickets, lockers } = bookingData;
  const ticketTotal = tickets?.total || 0;
  const lockerTotal = lockers?.price || 0;
  const subtotal = ticketTotal + lockerTotal;
  const tax = Math.round(subtotal * 0.08); // 8% tax
  const grandTotal = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Summary</h1>
            <p className="text-muted-foreground">Review your selections before checkout</p>
          </div>

          <div className="heritage-grid">
            {/* Main Content */}
            <div className="md:col-span-8 space-y-6">
              {/* Visit Details */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Visit Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="font-semibold">Date & Time</p>
                    <p className="text-muted-foreground">
                      {formatDate(tickets.date)} at {tickets.timeSlot}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Tickets */}
              <Card className="heritage-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Museum Tickets</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleEditTickets}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </CardHeader>
                <CardContent className="space-y-3">
                  {Object.entries(tickets.tickets)
                    .filter(([_, qty]: [string, any]) => qty > 0)
                    .map(([ticketId, qty]: [string, any]) => (
                      <div key={ticketId} className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{qty}x {getTicketTypeLabel(ticketId)}</span>
                        </div>
                        <span className="font-semibold">
                          ${(() => {
                            const prices: { [key: string]: number } = {
                              adult: 25, senior: 20, student: 18, child: 12, family: 65
                            };
                            return (prices[ticketId] || 0) * qty;
                          })()}
                        </span>
                      </div>
                    ))}
                  
                  <Separator />
                  <div className="flex justify-between font-semibold">
                    <span>Tickets Subtotal</span>
                    <span>${ticketTotal}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Lockers */}
              <Card className="heritage-card">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Locker Storage</CardTitle>
                  <Button variant="outline" size="sm" onClick={handleEditLockers}>
                    <Edit2 className="h-4 w-4 mr-2" />
                    {lockers ? 'Edit' : 'Add'}
                  </Button>
                </CardHeader>
                <CardContent>
                  {lockers ? (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <span className="font-medium">{lockers.count}x Locker</span>
                          <Badge variant="secondary" className="ml-2">{lockers.duration}</Badge>
                        </div>
                        <span className="font-semibold">${lockers.price}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                        ✅ Locker codes will be delivered with your tickets
                      </div>
                      
                      <Separator />
                      <div className="flex justify-between font-semibold">
                        <span>Locker Subtotal</span>
                        <span>${lockers.price}</span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6">
                      <p className="text-muted-foreground mb-4">No lockers selected</p>
                      <Button variant="outline" onClick={handleEditLockers}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Locker Storage
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Order Total */}
            <div className="md:col-span-4">
              <Card className="heritage-card sticky top-24">
                <CardHeader>
                  <CardTitle>Order Total</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span>Tickets</span>
                    <span>${ticketTotal}</span>
                  </div>
                  
                  {lockers && (
                    <div className="flex justify-between">
                      <span>Locker storage</span>
                      <span>${lockerTotal}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>Tax (8%)</span>
                    <span>${tax}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total</span>
                    <span>${grandTotal}</span>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Button 
                      onClick={handleProceedToCheckout}
                      className="w-full heritage-button-primary"
                    >
                      Proceed to Checkout
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                    
                    <Button 
                      variant="outline"
                      onClick={() => navigate('/locker-selection')}
                      className="w-full"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Lockers
                    </Button>
                  </div>

                  {/* Booking Benefits */}
                  <div className="mt-6 p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm font-semibold mb-2">Booking Benefits</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>• Instant confirmation</li>
                      <li>• Mobile tickets accepted</li>
                      <li>• Free cancellation up to 24h</li>
                      <li>• Priority entry access</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Summary;