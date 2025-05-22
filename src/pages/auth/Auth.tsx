
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

type AuthMode = 'signIn' | 'signUp' | 'forgotPassword';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>('signIn');
  const [resetSent, setResetSent] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/admin');
    }
  }, [user, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'signUp') {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              username: email.split('@')[0],
              full_name: '',
            },
          },
        });
        
        if (error) throw error;
        
        toast.success('Check your email for the confirmation link');
        console.log('Sign up successful:', data);
      } else if (mode === 'signIn') {
        console.log('Attempting sign in with:', email);
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        
        if (error) throw error;
        
        console.log('Sign in successful:', data);
        navigate('/admin');
      } else if (mode === 'forgotPassword') {
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`,
        });
        
        if (error) throw error;
        
        setResetSent(true);
        toast.success('Password reset email sent');
      }
    } catch (error: any) {
      console.error('Authentication error:', error);
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const renderForm = () => {
    if (mode === 'forgotPassword') {
      if (resetSent) {
        return (
          <div className="text-center space-y-4">
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Reset link has been sent to your email. Please check your inbox.
              </AlertDescription>
            </Alert>
            <Button 
              type="button" 
              variant="outline" 
              className="w-full mt-4"
              onClick={() => {
                setMode('signIn');
                setResetSent(false);
              }}
            >
              Back to Sign In
            </Button>
          </div>
        );
      }
      
      return (
        <form onSubmit={handleAuth} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="your@email.com"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Processing...' : 'Reset Password'}
          </Button>
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setMode('signIn')}
          >
            Back to Sign In
          </Button>
        </form>
      );
    }

    return (
      <form onSubmit={handleAuth} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="your@email.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Processing...' : mode === 'signUp' ? 'Sign Up' : 'Sign In'}
        </Button>
        <div className="flex flex-col space-y-2">
          <Button
            type="button"
            variant="link"
            onClick={() => setMode(mode === 'signUp' ? 'signIn' : 'signUp')}
          >
            {mode === 'signUp' ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
          {mode === 'signIn' && (
            <Button
              type="button"
              variant="link"
              onClick={() => setMode('forgotPassword')}
            >
              Forgot password?
            </Button>
          )}
        </div>
      </form>
    );
  };

  // Handle password reset if coming from a reset link
  useEffect(() => {
    const hash = location.hash;
    if (hash && hash.includes('type=recovery')) {
      navigate('/auth/reset-password' + hash);
    }
  }, [location, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>
            {mode === 'signIn' 
              ? 'Sign In' 
              : mode === 'signUp' 
                ? 'Create Account' 
                : 'Reset Password'}
          </CardTitle>
          <CardDescription>
            {mode === 'signIn'
              ? 'Sign in to access admin features'
              : mode === 'signUp'
                ? 'Create a new account to access admin features'
                : 'Enter your email to receive a password reset link'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderForm()}
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;
