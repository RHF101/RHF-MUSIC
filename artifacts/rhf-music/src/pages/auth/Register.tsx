import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { supabase } from '../../lib/supabase';
import { UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function Register() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      toast({ title: 'Supabase not configured', variant: 'destructive' });
      return;
    }
    if (password !== confirm) {
      toast({ title: 'Passwords do not match', variant: 'destructive' });
      return;
    }
    if (password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) {
      toast({ title: 'Registration failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created!', description: 'Check your email to confirm your account.' });
      setLocation('/auth/login');
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
          <p className="text-muted-foreground">Create your account</p>
        </div>

        {!supabase && (
          <div className="mb-6 p-4 rounded-xl bg-primary/10 border border-primary/20 text-sm text-primary text-center">
            Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to enable authentication.
          </div>
        )}

        <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <Label htmlFor="email">Email</Label>
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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                data-testid="input-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirm">Confirm Password</Label>
              <Input
                id="confirm"
                data-testid="input-confirm-password"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="mt-1.5 h-11"
                required
              />
            </div>
            <Button
              data-testid="button-register"
              type="submit"
              disabled={loading || !email || !password || !confirm}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl mt-2"
            >
              {loading ? 'Creating account...' : (
                <><UserPlus className="w-4 h-4 mr-2" />Create Account</>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{' '}
            <a href="/auth/login" className="text-primary hover:underline font-medium">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  );
}
