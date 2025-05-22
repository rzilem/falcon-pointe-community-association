
import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
  sendPasswordResetEmail: (email: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
  sendPasswordResetEmail: async () => ({ success: false }),
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Handle auth state changes
  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log("Auth state change event:", event);
        
        if (newSession !== session) {
          setSession(newSession);
          setUser(newSession?.user ?? null);
          
          // Check admin status if user is logged in
          if (newSession?.user) {
            // Use setTimeout to avoid Supabase auth deadlock
            setTimeout(() => {
              checkAdminStatus(newSession.user.id);
            }, 0);
          } else {
            setIsAdmin(false);
          }
        }
      }
    );

    // Initial session check
    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        console.log("Initial session check:", initialSession ? "Session found" : "No session");
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          setTimeout(() => {
            checkAdminStatus(initialSession.user.id);
          }, 0);
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      subscription.unsubscribe();
    }
  }, []);

  const checkAdminStatus = async (userId: string) => {
    try {
      console.log("Checking admin status for user:", userId);
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
        return;
      }

      console.log("Admin status check result:", data);
      setIsAdmin(data?.role === 'admin');
    } catch (err) {
      console.error("Unexpected error during admin status check:", err);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error);
      toast({
        variant: "destructive",
        title: "Sign out failed",
        description: error.message,
      });
      return;
    }
    navigate('/auth');
  };

  const sendPasswordResetEmail = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        console.error('Error sending password reset:', error);
        toast({
          variant: 'destructive',
          title: 'Password reset failed',
          description: error.message,
        });
        return { success: false, error: error.message };
      }

      toast({
        title: 'Password reset email sent',
        description: 'Please check your inbox for further instructions',
      });
      
      return { success: true };
    } catch (err: any) {
      console.error('Error sending password reset:', err);
      toast({
        variant: 'destructive',
        title: 'Password reset failed',
        description: err.message,
      });
      return { success: false, error: err.message };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAdmin, 
      loading,
      signOut,
      sendPasswordResetEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};
