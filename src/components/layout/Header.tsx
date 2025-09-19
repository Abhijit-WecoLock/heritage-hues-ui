import { Button } from "@/components/ui/button";
import { MapPin, User, Menu } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="heritage-header sticky top-0 z-50 border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-header-foreground">Heritage City Museum</h1>
              <p className="text-xs text-header-foreground/80">Tickets & Lockers</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors hover:text-header-foreground/80 ${
                isActive('/') ? 'text-header-foreground border-b-2 border-primary' : 'text-header-foreground/90'
              }`}
            >
              Book Tickets
            </Link>
            <Link 
              to="/my-bookings" 
              className={`text-sm font-medium transition-colors hover:text-header-foreground/80 ${
                isActive('/my-bookings') ? 'text-header-foreground border-b-2 border-primary' : 'text-header-foreground/90'
              }`}
            >
              My Bookings
            </Link>
            <Link 
              to="/visitor-info" 
              className={`text-sm font-medium transition-colors hover:text-header-foreground/80 ${
                isActive('/visitor-info') ? 'text-header-foreground border-b-2 border-primary' : 'text-header-foreground/90'
              }`}
            >
              Visitor Info
            </Link>
            <Link 
              to="/admin" 
              className={`text-xs font-medium transition-colors hover:text-header-foreground/80 ${
                isActive('/admin') ? 'text-header-foreground border-b-2 border-primary' : 'text-header-foreground/70'
              }`}
            >
              Admin
            </Link>
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-header-bg/80 hidden md:flex">
              <User className="h-4 w-4 mr-2" />
              Account
            </Button>
            
            {/* Mobile Menu Button */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden text-header-foreground hover:bg-header-bg/80"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="text-header-foreground/90 hover:text-header-foreground text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Book Tickets
              </Link>
              <Link 
                to="/my-bookings" 
                className="text-header-foreground/90 hover:text-header-foreground text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                My Bookings
              </Link>
              <Link 
                to="/visitor-info" 
                className="text-header-foreground/90 hover:text-header-foreground text-sm font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Visitor Info
              </Link>
              <Link 
                to="/admin" 
                className="text-header-foreground/70 hover:text-header-foreground text-xs font-medium py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
              <Button variant="ghost" size="sm" className="text-header-foreground hover:bg-header-bg/80 justify-start mt-2">
                <User className="h-4 w-4 mr-2" />
                Account
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;