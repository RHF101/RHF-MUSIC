import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../../lib/supabase';
import { Music2, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Login() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast({ title: 'Supabase not configured', description: 'Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Login failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Welcome back!' });
      setLocation('/');
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-4">
            <img src="/rhf-logo.png" alt="RHF MUSIC" className="w-12 h-12 object-contain" onError={(e) => (e.currentTarget.style.display = 'none')} />
            <span className="font-serif text-3xl font-bold text-primary">RHF MUSIC</span>
          </div>
          <p className="text-muted-foreground">Sign in to your account</p>
        </div>

        {!supabase && (
          <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary text-center">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input
                id="email"
                data-testid="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium">Password</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <Button
              data-testid="button-login"
              type="submit"
              disabled={loading || !email || !password}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl mt-2"
            >
              {loading ? 'Signing in...' : (
                <><LogIn className="w-4 h-4 mr-2" />Sign In</>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Don&apos;t have an account?{' '}
            <a href="/auth/register" className="text-primary hover:underline font-medium">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
}
