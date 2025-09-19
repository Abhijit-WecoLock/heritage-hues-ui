import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, MapPin, Lock, Ticket, Plus, Settings, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

interface Booking {
  id: string;
  date: string;
  timeSlot: string;
  tickets: { [key: string]: number };
  lockers?: {
    count: number;
    duration: string;
    expiresAt: string;
  };
  status: 'upcoming' | 'active' | 'completed' | 'cancelled';
  total: number;
}

// Mock data for demonstration
const mockBookings: Booking[] = [
  {
    id: 'HCM123ABC',
    date: '2024-01-15',
    timeSlot: '10:30 AM',
    tickets: { adult: 2, child: 1 },
    lockers: {
      count: 2,
      duration: '4 hours',
      expiresAt: '2024-01-15T14:30:00Z'
    },
    status: 'upcoming',
    total: 78
  },
  {
    id: 'HCM456DEF',
    date: '2023-12-10',
    timeSlot: '2:00 PM',
    tickets: { family: 1 },
    status: 'completed',
    total: 65
  }
];

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<Booking[]>(mockBookings);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getTimeRemaining = (expiresAt: string) => {
    const now = new Date().getTime();
    const expires = new Date(expiresAt).getTime();
    const diff = expires - now;
    
    if (diff <= 0) return 'Expired';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 0) return `${hours}h ${minutes}m remaining`;
    return `${minutes}m remaining`;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      upcoming: { variant: 'default', label: 'Upcoming' },
      active: { variant: 'default', label: 'Active' },
      completed: { variant: 'secondary', label: 'Completed' },
      cancelled: { variant: 'destructive', label: 'Cancelled' }
    };
    
    const config = variants[status as keyof typeof variants] || variants.upcoming;
    
    return (
      <Badge variant={config.variant as any} className="capitalize">
        {config.label}
      </Badge>
    );
  };

  const getTicketSummary = (tickets: { [key: string]: number }) => {
    return Object.entries(tickets)
      .filter(([_, qty]) => qty > 0)
      .map(([type, qty]) => `${qty}x ${type.charAt(0).toUpperCase() + type.slice(1)}`)
      .join(', ');
  };

  const handleExtendLocker = (bookingId: string) => {
    alert(`Extend locker functionality for ${bookingId} would be implemented here`);
  };

  const handleUpgradeLocker = (bookingId: string) => {
    alert(`Upgrade locker functionality for ${bookingId} would be implemented here`);
  };

  const handleAddMoreTickets = (bookingId: string) => {
    alert(`Add more tickets functionality for ${bookingId} would be implemented here`);
  };

  const handleCancelBooking = (bookingId: string) => {
    alert(`Cancel booking functionality for ${bookingId} would be implemented here`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">My Bookings</h1>
              <p className="text-muted-foreground">Manage your Heritage City Museum visits</p>
            </div>
            <Button 
              onClick={() => navigate('/tickets')}
              className="heritage-button-primary"
            >
              <Plus className="mr-2 h-4 w-4" />
              New Booking
            </Button>
          </div>

          {/* Bookings List */}
          <div className="space-y-6">
            {bookings.length === 0 ? (
              <Card className="heritage-card text-center p-12">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground mb-6">
                  You haven't made any bookings yet. Start planning your visit!
                </p>
                <Button 
                  onClick={() => navigate('/tickets')}
                  className="heritage-button-primary"
                >
                  Book Your First Visit
                </Button>
              </Card>
            ) : (
              bookings.map((booking) => (
                <Card key={booking.id} className="heritage-card">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <CardTitle className="text-lg">Booking {booking.id}</CardTitle>
                        {getStatusBadge(booking.status)}
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${booking.total}</div>
                        <div className="text-xs text-muted-foreground">Total paid</div>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {/* Visit Details */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Date</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDate(booking.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Time</p>
                          <p className="text-xs text-muted-foreground">
                            {booking.timeSlot}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Ticket className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">Tickets</p>
                          <p className="text-xs text-muted-foreground">
                            {getTicketSummary(booking.tickets)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Locker Details */}
                    {booking.lockers && (
                      <div className="p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Lock className="h-4 w-4 text-primary" />
                            <span className="text-sm font-medium">
                              {booking.lockers.count} Locker{booking.lockers.count > 1 ? 's' : ''} Reserved
                            </span>
                          </div>
                          {booking.status === 'active' && (
                            <Badge variant="outline" className="text-xs">
                              {getTimeRemaining(booking.lockers.expiresAt)}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Duration: {booking.lockers.duration}
                        </p>
                      </div>
                    )}

                    {/* Action Buttons */}
                    {booking.status === 'upcoming' && (
                      <>
                        <Separator />
                        <div className="flex flex-wrap gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleAddMoreTickets(booking.id)}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Add Tickets
                          </Button>
                          
                          {booking.lockers && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleExtendLocker(booking.id)}
                              >
                                <Clock className="mr-1 h-3 w-3" />
                                Extend Locker
                              </Button>
                              
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleUpgradeLocker(booking.id)}
                              >
                                <Settings className="mr-1 h-3 w-3" />
                                Upgrade Locker
                              </Button>
                            </>
                          )}
                          
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleCancelBooking(booking.id)}
                          >
                            Cancel Booking
                          </Button>
                        </div>
                      </>
                    )}

                    {/* Warning for expiring lockers */}
                    {booking.lockers && booking.status === 'active' && (
                      <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg text-orange-800">
                        <AlertCircle className="h-4 w-4" />
                        <p className="text-xs">
                          Your locker will expire soon. Extend your reservation if you need more time.
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Help Section */}
          <Card className="heritage-card mt-8">
            <CardContent className="p-6 text-center">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Contact our support team for assistance with your bookings
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button variant="outline" size="sm">
                  Contact Support
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => navigate('/visitor-info')}
                >
                  Visitor Information
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default MyBookings;