import React from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../hooks/use-auth';
import { Home, Search, Library, Heart, Clock, Settings, LogIn, LogOut } from 'lucide-react';
import { Button } from './ui/button';

export const Sidebar: React.FC = () => {
  const [location] = useLocation();
  const { user, signOut } = useAuth();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home className="w-5 h-5" /> },
    { label: 'Search', path: '/search', icon: <Search className="w-5 h-5" /> },
    { label: 'Your Library', path: '/library', icon: <Library className="w-5 h-5" /> },
  ];

  const personalItems = [
    { label: 'Liked Songs', path: '/liked', icon: <Heart className="w-5 h-5" /> },
    { label: 'History', path: '/history', icon: <Clock className="w-5 h-5" /> },
  ];

  return (
    <div className="w-[220px] h-full bg-background border-r border-border flex flex-col pt-6 pb-24 px-4 glass-panel shrink-0 fixed left-0 top-0 bottom-0 z-10">
      <div className="flex items-center mb-8 px-2">
        <img src="/rhf-logo.png" alt="RHF MUSIC" className="w-8 h-8 mr-3 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
        <span className="font-serif text-xl font-bold tracking-wider text-primary">RHF MUSIC</span>
      </div>

      <nav className="space-y-1 mb-8">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <div className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
              location === item.path 
                ? 'bg-primary/10 text-primary font-medium' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
            }`}>
              {item.icon}
              <span>{item.label}</span>
            </div>
          </Link>
        ))}
      </nav>

      {user && (
        <div className="space-y-1 mb-8">
          <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Your Music
          </div>
          {personalItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                location === item.path 
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}>
                {item.icon}
                <span>{item.label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-auto space-y-2">
        {user ? (
          <>
            <Link href="/admin">
              <div className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors cursor-pointer ${
                location.startsWith('/admin')
                  ? 'bg-primary/10 text-primary font-medium' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }`}>
                <Settings className="w-5 h-5" />
                <span>Admin Panel</span>
              </div>
            </Link>
            <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-foreground" onClick={signOut}>
              <LogOut className="w-5 h-5 mr-3" />
              <span>Log out</span>
            </Button>
          </>
        ) : (
          <Link href="/auth/login" className="w-full">
            <Button variant="default" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <LogIn className="w-4 h-4 mr-2" />
              Log in
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
};
