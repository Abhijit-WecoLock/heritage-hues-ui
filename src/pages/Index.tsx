import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Ticket, Calendar, Lock, Users, Clock, MapPin, ArrowRight, CheckCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import HeroImage from "@/components/ui/hero-image";

const features = [
  {
    icon: Ticket,
    title: "Skip the Lines",
    description: "Pre-book your entry tickets and walk straight in"
  },
  {
    icon: Lock,
    title: "Secure Storage",
    description: "Reserve lockers for your belongings during your visit"
  },
  {
    icon: Clock,
    title: "Flexible Timing",
    description: "Choose your preferred time slot and duration"
  },
  {
    icon: Users,
    title: "Group Bookings",
    description: "Special rates for families and large groups"
  }
];

const quickStats = [
  { label: "Artifacts", value: "50,000+" },
  { label: "Years of History", value: "5,000" },
  { label: "Monthly Visitors", value: "85,000" },
  { label: "Exhibitions", value: "12" }
];

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 animate-page-enter">
        <div className="container mx-auto px-4">
          <div className="heritage-grid items-center">
            <div className="md:col-span-7 animate-fade-up">
              <Badge className="mb-4 bg-secondary/10 text-secondary-foreground border-secondary/20">
                Open Daily 9 AM - 6 PM
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                Discover
                <span className="block text-primary">5000 Years</span>
                of Human History
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl">
                Book your tickets and reserve lockers for a seamless visit to Heritage City Museum. 
                Experience world-class exhibitions with secure storage for your belongings.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="heritage-button-primary text-lg px-8 py-6"
                  onClick={() => navigate('/tickets')}
                >
                  Book Tickets Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="heritage-button-secondary text-lg px-8 py-6"
                  onClick={() => navigate('/my-bookings')}
                >
                  Manage Booking
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {quickStats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-2xl font-bold text-primary">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="md:col-span-5 animate-fade-up" style={{ animationDelay: '150ms' }}>
              <HeroImage className="h-96 md:h-[500px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Why Book with Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Enjoy a premium museum experience with our convenient booking platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="heritage-card text-center animate-fade-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Current Exhibitions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Current Exhibitions</h2>
            <p className="text-muted-foreground">Don't miss these limited-time displays</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="heritage-card overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-heritage-terracotta to-heritage-olive"></div>
              <CardHeader>
                <Badge className="w-fit bg-secondary/10 text-secondary-foreground">Until March 2025</Badge>
                <CardTitle className="text-xl">Ancient Civilizations</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Journey through mesopotamian, Egyptian, and Greek antiquities spanning 3000 years.
                </p>
              </CardContent>
            </Card>

            <Card className="heritage-card overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-heritage-olive to-heritage-brown"></div>
              <CardHeader>
                <Badge className="w-fit bg-primary/10 text-primary-foreground">Permanent Collection</Badge>
                <CardTitle className="text-xl">Medieval Treasures</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Illuminated manuscripts, armor, and artifacts from the Middle Ages.
                </p>
              </CardContent>
            </Card>

            <Card className="heritage-card overflow-hidden">
              <div className="h-48 bg-gradient-to-br from-heritage-brown to-heritage-terracotta"></div>
              <CardHeader>
                <Badge className="w-fit bg-accent/10 text-accent-foreground">New Exhibition</Badge>
                <CardTitle className="text-xl">Maritime Heritage</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore shipwrecks, navigation tools, and oceanic trade routes.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready for Your Visit?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Book your tickets now and enjoy priority access with optional locker storage
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Instant confirmation
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Mobile tickets accepted
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle className="h-4 w-4 text-green-600" />
                Free cancellation
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg"
                className="heritage-button-primary px-8 py-6"
                onClick={() => navigate('/tickets')}
              >
                <Calendar className="mr-2 h-5 w-5" />
                Book Your Visit
              </Button>
              <Link to="/visitor-info">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="px-8 py-6 w-full sm:w-auto"
                >
                  <MapPin className="mr-2 h-5 w-5" />
                  Visitor Information
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;