import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, Phone, Mail, Car, Train, Bus, Accessibility, Camera, Coffee, Gift, Wifi } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";

const amenities = [
  { icon: Wifi, name: "Free WiFi", description: "Complimentary internet throughout the museum" },
  { icon: Coffee, name: "Museum Café", description: "Light meals and refreshments available" },
  { icon: Gift, name: "Gift Shop", description: "Unique souvenirs and educational materials" },
  { icon: Accessibility, name: "Accessibility", description: "Wheelchair accessible with ramps and elevators" },
  { icon: Camera, name: "Photography", description: "Personal photography allowed (no flash in galleries)" },
];

const transportOptions = [
  { icon: Car, name: "By Car", description: "Free parking available on-site with 200 spaces" },
  { icon: Train, name: "By Metro", description: "Museum Station on Blue Line (5-min walk)" },
  { icon: Bus, name: "By Bus", description: "Routes 15, 22, 44 stop directly outside" },
];

const VisitorInfo = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Visitor Information</h1>
            <p className="text-muted-foreground">Everything you need to know for your visit</p>
          </div>

          <div className="heritage-grid">
            {/* Left Column */}
            <div className="md:col-span-8 space-y-6">
              {/* Hours & Admission */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    Hours & Admission
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold mb-2">Opening Hours</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Monday - Friday</span>
                          <span>9:00 AM - 6:00 PM</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Saturday - Sunday</span>
                          <span>9:00 AM - 8:00 PM</span>
                        </div>
                        <div className="flex justify-between text-muted-foreground">
                          <span>Last admission</span>
                          <span>1 hour before closing</span>
                        </div>
                      </div>
                      <Badge className="mt-2 bg-green-100 text-green-800">Open Today</Badge>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Ticket Prices</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Adult (18-64)</span>
                          <span>$25</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Senior (65+)</span>
                          <span>$20</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Student</span>
                          <span>$18</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Child (5-17)</span>
                          <span>$12</span>
                        </div>
                        <div className="flex justify-between font-semibold">
                          <span>Family Pass</span>
                          <span>$65</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <Button 
                      onClick={() => navigate('/tickets')}
                      className="heritage-button-primary"
                    >
                      Book Tickets Now
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Location & Transportation */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Location & Transportation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Address</h4>
                    <p className="text-muted-foreground">
                      Heritage City Museum<br />
                      123 Museum Drive<br />
                      Heritage City, HC 12345
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-3">How to Get Here</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {transportOptions.map((option, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                          <option.icon className="h-5 w-5 text-primary mt-0.5" />
                          <div>
                            <p className="font-medium text-sm">{option.name}</p>
                            <p className="text-xs text-muted-foreground">{option.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Museum Amenities */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Museum Amenities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {amenities.map((amenity, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 border rounded-lg">
                        <amenity.icon className="h-5 w-5 text-primary mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">{amenity.name}</p>
                          <p className="text-xs text-muted-foreground">{amenity.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Visitor Guidelines */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Visitor Guidelines</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">What to Bring</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Photo ID (required for all visitors)</li>
                      <li>• Student ID for discounted admission</li>
                      <li>• Comfortable walking shoes</li>
                      <li>• Water bottle (refill stations available)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">What Not to Bring</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Large bags or backpacks (lockers available)</li>
                      <li>• Food and drinks (café available on-site)</li>
                      <li>• Pets (service animals welcome)</li>
                      <li>• Flash photography equipment</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Security</h4>
                    <p className="text-sm text-muted-foreground">
                      All visitors and bags are subject to security screening. 
                      Please allow extra time for entry during peak hours.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Quick Info */}
            <div className="md:col-span-4 space-y-6">
              {/* Contact Information */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Contact Us</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">General Information</p>
                      <p className="text-sm text-muted-foreground">(555) 123-4567</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-primary" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">info@heritagecitymuseum.org</p>
                    </div>
                  </div>
                  
                  <div className="pt-3 border-t">
                    <h4 className="font-semibold text-sm mb-2">Hours</h4>
                    <p className="text-xs text-muted-foreground">
                      Mon-Fri: 8:00 AM - 6:00 PM<br />
                      Sat-Sun: 9:00 AM - 5:00 PM
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Special Exhibitions */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Special Exhibitions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2 bg-secondary/10 text-secondary-foreground">Until March 2025</Badge>
                    <h4 className="font-semibold text-sm mb-1">Ancient Civilizations</h4>
                    <p className="text-xs text-muted-foreground">
                      Featured artifacts from Mesopotamia, Egypt, and Greece
                    </p>
                  </div>
                  
                  <div className="p-3 border rounded-lg">
                    <Badge className="mb-2 bg-primary/10 text-primary-foreground">New Exhibition</Badge>
                    <h4 className="font-semibold text-sm mb-1">Maritime Heritage</h4>
                    <p className="text-xs text-muted-foreground">
                      Shipwrecks and oceanic trade routes through history
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Group Visits */}
              <Card className="heritage-card">
                <CardHeader>
                  <CardTitle>Group Visits</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Special rates and guided tours available for groups of 10 or more.
                  </p>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      Request Group Quote
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      School Programs
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Emergency Info */}
              <Card className="heritage-card">
                <CardContent className="p-4">
                  <h4 className="font-semibold text-sm mb-2">Emergency</h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    In case of emergency, contact museum security or dial 911.
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Museum Security: (555) 123-4568
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default VisitorInfo;