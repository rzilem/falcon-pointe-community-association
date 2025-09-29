
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  isAdmin: false,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

// Cache for admin status to prevent redundant checks
let adminStatusCache: { [userId: string]: boolean } = {};
let adminCheckPromises: { [userId: string]: Promise<boolean> } = {};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const checkAdminStatus = useCallback(async (userId: string): Promise<boolean> => {
    // Return cached result if available
    if (adminStatusCache[userId] !== undefined) {
      return adminStatusCache[userId];
    }

    // Return existing promise if check is already in progress
    if (adminCheckPromises[userId]) {
      return adminCheckPromises[userId];
    }

    // Create new admin check promise
    adminCheckPromises[userId] = (async () => {
      try {
        console.log("Checking admin status for user:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error checking admin status:', error);
          adminStatusCache[userId] = false;
          return false;
        }

        const isUserAdmin = data?.role === 'admin';
        console.log("Admin status check result:", isUserAdmin);
        
        // Cache the result
        adminStatusCache[userId] = isUserAdmin;
        return isUserAdmin;
      } catch (err) {
        console.error("Unexpected error during admin status check:", err);
        adminStatusCache[userId] = false;
        return false;
      } finally {
        // Clean up the promise
        delete adminCheckPromises[userId];
      }
    })();

    return adminCheckPromises[userId];
  }, []);

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change event:", event);
        
        if (!mounted) return;

        setSession(session);
        setUser(session?.user ?? null);

        // Handle admin status check
        if (session?.user) {
          // Use setTimeout to avoid Supabase auth deadlock
          setTimeout(async () => {
            if (mounted) {
              try {
                const adminStatus = await checkAdminStatus(session.user.id);
                if (mounted) {
                  setIsAdmin(adminStatus);
                }
              } catch (error) {
                console.error('Failed to check admin status:', error);
                if (mounted) {
                  setIsAdmin(false);
                }
              }
            }
          }, 0);
        } else {
          setIsAdmin(false);
          // Clear cache when user logs out
          adminStatusCache = {};
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log("Initial session check:", session ? "Session found" : "No session");
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        try {
          const adminStatus = await checkAdminStatus(session.user.id);
          if (mounted) {
            setIsAdmin(adminStatus);
          }
        } catch (error) {
          console.error('Failed to check admin status on init:', error);
          if (mounted) {
            setIsAdmin(false);
          }
        }
      }
      
      if (mounted) {
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    }
  }, [checkAdminStatus]);

  const signOut = async () => {
    // Clear admin cache
    adminStatusCache = {};
    await supabase.auth.signOut();
    navigate('/auth');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
