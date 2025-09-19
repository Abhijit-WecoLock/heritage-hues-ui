import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditCard, Smartphone, Wallet, Lock, ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/layout/Header";
import { toast } from "@/hooks/use-toast";

const Checkout = () => {
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    billingZip: ""
  });

  useEffect(() => {
    const stored = sessionStorage.getItem('bookingData');
    if (stored) {
      setBookingData(JSON.parse(stored));
    } else {
      navigate('/tickets');
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  const validateForm = () => {
    const required = ['email', 'firstName', 'lastName'];
    if (paymentMethod === 'card') {
      required.push('cardNumber', 'expiryDate', 'cvv');
    }
    
    return required.every(field => formData[field as keyof typeof formData].trim() !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast({
        title: "Incomplete Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Generate booking ID
      const bookingId = `HCM${Date.now().toString(36).toUpperCase()}`;
      
      // Store confirmation data
      sessionStorage.setItem('confirmationData', JSON.stringify({
        ...bookingData,
        bookingId,
        customerInfo: formData,
        paymentMethod,
        confirmedAt: new Date().toISOString()
      }));

      navigate('/confirmation');
      
    } catch (error) {
      toast({
        title: "Payment Error",
        description: "Payment couldn't be processed. Try again or use another method.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground">Loading checkout...</p>
        </div>
      </div>
    );
  }

  const { tickets, lockers } = bookingData;
  const subtotal = (tickets?.total || 0) + (lockers?.price || 0);
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 animate-page-enter">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Secure Checkout</h1>
            <p className="text-muted-foreground">Complete your booking with secure payment</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="heritage-grid">
              {/* Left Column - Forms */}
              <div className="md:col-span-8 space-y-6">
                {/* Contact Information */}
                <Card className="heritage-card">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="phone">Phone Number (Optional)</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Payment Method */}
                <Card className="heritage-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lock className="h-5 w-5 text-primary" />
                      Payment Method
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-4 border rounded-lg">
                          <RadioGroupItem value="card" id="card" />
                          <CreditCard className="h-5 w-5" />
                          <Label htmlFor="card" className="flex-1 cursor-pointer">
                            Credit or Debit Card
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-60">
                          <RadioGroupItem value="upi" id="upi" disabled />
                          <Smartphone className="h-5 w-5" />
                          <Label htmlFor="upi" className="flex-1 cursor-pointer">
                            UPI Payment (Coming Soon)
                          </Label>
                        </div>
                        
                        <div className="flex items-center space-x-3 p-4 border rounded-lg opacity-60">
                          <RadioGroupItem value="wallet" id="wallet" disabled />
                          <Wallet className="h-5 w-5" />
                          <Label htmlFor="wallet" className="flex-1 cursor-pointer">
                            Digital Wallet (Coming Soon)
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>

                    {/* Card Details */}
                    {paymentMethod === 'card' && (
                      <div className="space-y-4 pt-4 border-t">
                        <div>
                          <Label htmlFor="cardNumber">Card Number *</Label>
                          <Input
                            id="cardNumber"
                            value={formData.cardNumber}
                            onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            required
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiryDate">Expiry Date *</Label>
                            <Input
                              id="expiryDate"
                              value={formData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                              placeholder="MM/YY"
                              maxLength={5}
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="cvv">CVV *</Label>
                            <Input
                              id="cvv"
                              value={formData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, '').slice(0, 4))}
                              placeholder="123"
                              maxLength={4}
                              required
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor="billingZip">Billing ZIP Code</Label>
                          <Input
                            id="billingZip"
                            value={formData.billingZip}
                            onChange={(e) => handleInputChange('billingZip', e.target.value)}
                            placeholder="12345"
                            maxLength={10}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Right Column - Order Summary */}
              <div className="md:col-span-4">
                <Card className="heritage-card sticky top-24">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Museum Tickets</span>
                        <span>${tickets?.total || 0}</span>
                      </div>
                      
                      {lockers && (
                        <div className="flex justify-between text-sm">
                          <span>Locker Storage</span>
                          <span>${lockers.price}</span>
                        </div>
                      )}
                      
                      <div className="flex justify-between text-sm">
                        <span>Subtotal</span>
                        <span>${subtotal}</span>
                      </div>
                      
                      <div className="flex justify-between text-sm text-muted-foreground">
                        <span>Tax (8%)</span>
                        <span>${tax}</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="flex justify-between font-bold text-lg">
                        <span>Total</span>
                        <span>${total}</span>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button 
                        type="submit"
                        className="w-full heritage-button-primary"
                        disabled={isProcessing || !validateForm()}
                      >
                        {isProcessing ? (
                          "Processing Payment..."
                        ) : (
                          <>
                            Complete Payment ${total}
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </>
                        )}
                      </Button>
                      
                      <Button 
                        type="button"
                        variant="outline"
                        onClick={() => navigate('/summary')}
                        className="w-full"
                        disabled={isProcessing}
                      >
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Summary
                      </Button>
                    </div>

                    {/* Security Notice */}
                    <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2 text-sm">
                        <Lock className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Secure Payment</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Your payment information is encrypted and secure
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Checkout;