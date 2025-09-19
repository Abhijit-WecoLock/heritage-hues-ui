import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Download, Mail, Smartphone, Calendar, MapPin, Lock, Ticket } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

const Confirmation = () => {
  const navigate = useNavigate();
  const [confirmationData, setConfirmationData] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('confirmationData');
    if (stored) {
      setConfirmationData(JSON.parse(stored));
      // Trigger confetti animation
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      navigate('/');
    }
  }, [navigate]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      weekday: 'long',
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const generateQRPlaceholder = (id: string) => {
    // Simple QR code placeholder - in a real app, this would be generated properly
    return `data:image/svg+xml,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
        <rect width="120" height="120" fill="white" stroke="#ddd"/>
        <g fill="#333">
          <rect x="10" y="10" width="10" height="10"/>
          <rect x="30" y="10" width="10" height="10"/>
          <rect x="50" y="10" width="10" height="10"/>
          <rect x="70" y="10" width="10" height="10"/>
          <rect x="90" y="10" width="10" height="10"/>
          <rect x="100" y="10" width="10" height="10"/>
        </g>
        <text x="60" y="65" text-anchor="middle" font-size="8" fill="#666">${id}</text>
      </svg>
    `)}`;
  };

  const handleSaveToWallet = () => {
    // In a real implementation, this would generate wallet passes
    alert('Wallet integration would be implemented here');
  };

  const handleDownloadTickets = () => {
    // In a real implementation, this would generate PDF tickets
    alert('PDF generation would be implemented here');
  };

  if (!confirmationData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading confirmation...</p>
        </div>
      </div>
    );
  }

  const { bookingId, tickets, lockers, customerInfo } = confirmationData;

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      
      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {Array.from({ length: 50 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-primary animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 1000}ms`,
                animationDuration: `${1000 + Math.random() * 2000}ms`
              }}
            />
          ))}
        </div>
      )}
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8 animate-fade-up">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Your Heritage City Museum visit is all set
            </p>
            <Badge className="mt-2 bg-green-100 text-green-800 border-green-200">
              Booking ID: {bookingId}
            </Badge>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Button 
              variant="outline"
              className="p-6 h-auto flex-col space-y-2"
              onClick={handleDownloadTickets}
            >
              <Download className="h-6 w-6" />
              <span>Download Tickets</span>
            </Button>
            
            <Button 
              variant="outline"
              className="p-6 h-auto flex-col space-y-2"
              onClick={handleSaveToWallet}
            >
              <Smartphone className="h-6 w-6" />
              <span>Save to Wallet</span>
            </Button>
            
            <Button 
              variant="outline"
              className="p-6 h-auto flex-col space-y-2"
              onClick={() => navigate('/my-bookings')}
            >
              <Calendar className="h-6 w-6" />
              <span>My Bookings</span>
            </Button>
          </div>

          <div className="heritage-grid">
            {/* Ticket QR Codes */}
            <div className="md:col-span-7 space-y-6">
              {/* Museum Tickets */}
              <Card className="heritage-card">
                <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                  <Ticket className="h-5 w-5 text-primary mr-2" />
                  <CardTitle>Museum Entry Tickets</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="text-center p-4 border rounded-lg">
                      <img 
                        src={generateQRPlaceholder(bookingId)} 
                        alt="Ticket QR Code"
                        className="mx-auto mb-3"
                      />
                      <p className="text-sm font-medium">Entry QR Code</p>
                      <p className="text-xs text-muted-foreground">Show at museum entrance</p>
                    </div>
                    
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-medium">Visit Date</p>
                        <p className="text-sm text-muted-foreground">
                          {formatDate(tickets.date)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Time Slot</p>
                        <p className="text-sm text-muted-foreground">
                          {tickets.timeSlot}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Tickets</p>
                        <div className="text-sm text-muted-foreground">
                          {Object.entries(tickets.tickets)
                            .filter(([_, qty]: [string, any]) => qty > 0)
                            .map(([type, qty]: [string, any]) => (
                              <div key={type}>{qty}x {type.charAt(0).toUpperCase() + type.slice(1)}</div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Locker QR Codes */}
              {lockers && (
                <Card className="heritage-card">
                  <CardHeader className="flex flex-row items-center space-y-0 pb-3">
                    <Lock className="h-5 w-5 text-primary mr-2" />
                    <CardTitle>Locker Storage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="text-center p-4 border rounded-lg">
                        <img 
                          src={generateQRPlaceholder(`${bookingId}-LOCKER`)} 
                          alt="Locker QR Code"
                          className="mx-auto mb-3"
                        />
                        <p className="text-sm font-medium">Locker Access Code</p>
                        <p className="text-xs text-muted-foreground">Use at locker station</p>
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-sm font-medium">Lockers Reserved</p>
                          <p className="text-sm text-muted-foreground">
                            {lockers.count} locker{lockers.count > 1 ? 's' : ''}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Duration</p>
                          <p className="text-sm text-muted-foreground">
                            {lockers.duration}
                          </p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-800">
                            <strong>Note:</strong> Locker access codes are also sent to your email. 
                            Lockers will automatically unlock when your time expires.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Booking Details */}
            <div className="md:col-span-5 space-y-6">
              {/* Important Information */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-primary" />
                    Email Sent
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium">Confirmation sent to:</p>
                        <p className="text-sm text-muted-foreground">{customerInfo.email}</p>
                      </div>
                    </div>
                    
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>• Check your spam folder if you don't see the email</p>
                      <p>• Allow up to 5 minutes for delivery</p>
                      <p>• Contact support if you need help</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Visit Information */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Visit Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium">Heritage City Museum</p>
                    <p className="text-muted-foreground">
                      123 Museum Drive<br />
                      Heritage City, HC 12345
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium">Hours</p>
                    <p className="text-muted-foreground">
                      Daily: 9:00 AM - 6:00 PM<br />
                      Last entry: 5:00 PM
                    </p>
                  </div>
                  
                  <div>
                    <p className="font-medium">What to Bring</p>
                    <ul className="text-muted-foreground text-xs mt-1 space-y-1">
                      <li>• Photo ID (required for entry)</li>
                      <li>• This confirmation email or QR code</li>
                      <li>• Student ID (if applicable)</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Support */}
              <Card className="heritage-card">
                <CardContent className="p-4 text-center">
                  <p className="text-sm font-medium mb-2">Need Help?</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Our team is here to assist you
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Contact Support
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      onClick={() => navigate('/visitor-info')}
                    >
                      Visitor Information
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Return to Home */}
          <div className="text-center mt-12">
            <Button 
              onClick={() => navigate('/')}
              className="heritage-button-primary px-8 py-3"
            >
              Plan Another Visit
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Confirmation;