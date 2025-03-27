
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart3, CalendarCheck, LayoutDashboard, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const NavItems = [
  { title: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { title: 'Reservas', icon: CalendarCheck, path: '/reservations' },
  { title: 'Estatísticas', icon: BarChart3, path: '/statistics' },
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/80 border-b border-border">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link 
            to="/" 
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary text-white font-semibold">
              U
            </div>
            <span className="font-bold text-lg hidden sm:inline-block">UniEVANGÉLICA</span>
            <span className="font-medium text-muted-foreground hidden sm:inline-block">Reservas</span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {NavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                location.pathname === item.path 
                  ? "text-primary" 
                  : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.title}
            </Link>
          ))}
        </nav>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex items-center justify-center rounded-md w-9 h-9 text-muted-foreground hover:text-foreground hover:bg-accent"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>
      
      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 animate-fade-in">
          <nav className="container py-6 flex flex-col space-y-4">
            {NavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-md text-sm font-medium transition-colors",
                  location.pathname === item.path 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent"
                )}
                onClick={() => setIsOpen(false)}
              >
                <item.icon className="h-5 w-5" />
                {item.title}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
