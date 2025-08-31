import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';
import { UserProfile } from './types';

interface AuthContextType {
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  setProfile: (profile: UserProfile | null) => void;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  profile: null,
  isLoading: true,
  setProfile: () => {},
  signOut: () => {},
});

export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        
        if (session) {
          const { data, error } = await supabase
            .from('profiles')
            .select(`
              *,
              user_settings(*)
            `)
            .eq('id', session.user.id)
            .single();

          if (error) {
            console.error('Error fetching profile:', error);
          } else if (data) {
            const userProfile: UserProfile = {
                id: data.id,
                name: data.name,
                created_at: data.created_at,
                // Flatten user_settings
                ...(data.user_settings[0] || {})
            };
            setProfile(userProfile);
          }
        }
      } catch (e) {
        console.error('Failed to fetch session:', e);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        if(!session) {
            setProfile(null);
        } else {
            // Re-fetch profile on sign in
            fetchSession();
        }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };
  
  const value = {
    session,
    profile,
    isLoading,
    setProfile,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
