import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: fetch or create profile
  const fetchOrCreateProfile = async (sessionUser) => {
    if (!sessionUser) return null;
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      if (!data) {
        // Fallback profile creation if trigger hasn't run or completed yet
        const meta = sessionUser.user_metadata || {};
        const newProfile = {
          id: sessionUser.id,
          full_name: meta.full_name || meta.name || '',
          avatar_url: meta.avatar_url || meta.picture || '',
          email: sessionUser.email || '',
          semester: '',
          branch: '',
          student_id: '',
          is_complete: false,
        };

        const { data: inserted, error: insertError } = await supabase
          .from('profiles')
          .insert([newProfile])
          .select()
          .maybeSingle();

        if (insertError) {
          console.error('Failed client-side profile creation fallback:', insertError);
          // If we fail because it exists now (concurrency/trigger), let's retry fetch
          const { data: retryData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', sessionUser.id)
            .maybeSingle();
          return retryData;
        }
        return inserted;
      }

      return data;
    } catch (err) {
      console.error('Unexpected error in profile operation:', err);
      return null;
    }
  };

  // Helper: load registrations
  const fetchRegistrations = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('registrations')
        .select('*')
        .eq('user_id', userId)
        .order('registered_at', { ascending: false });

      if (error) {
        console.error('Error fetching registrations:', error);
        return [];
      }
      // Map database schema to App's ticket schema
      return (data || []).map(r => ({
        id: r.ticket_id || `TKT-${r.id.substr(0,8).toUpperCase()}`,
        eventId: r.event_id,
        eventTitle: r.event_title,
        eventDate: r.event_date,
        eventTime: r.event_time,
        eventVenue: r.event_venue,
        clubName: r.club_name,
        fullName: r.full_name,
        email: r.email,
        semester: r.semester,
        branch: r.branch,
        studentId: r.student_id,
        registeredAt: r.registered_at,
      }));
    } catch (err) {
      console.error('Unexpected error loading registrations:', err);
      return [];
    }
  };

  // Sign up
  const signUp = async (email, password, fullName) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        }
      }
    });

    if (error) {
      setLoading(false);
      throw error;
    }

    return data;
  };

  // Sign in with Email
  const signInWithEmail = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) {
      setLoading(false);
      throw error;
    }
    return data;
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin,
      }
    });
    if (error) throw error;
    return data;
  };

  // Sign out
  const signOut = async () => {
    setLoading(true);
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    setRegistrations([]);
    setLoading(false);
  };

  // Update profile details
  const updateProfile = async (updates) => {
    if (!user) throw new Error('Not logged in');
    try {
      const isComplete = !!(
        updates.semester && 
        updates.branch && 
        updates.student_id && 
        updates.full_name
      );

      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...updates,
          is_complete: isComplete,
        })
        .select()
        .single();

      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Error updating profile:', err);
      throw err;
    }
  };

  // Register for event
  const registerForEvent = async (event, profileData) => {
    if (!user) throw new Error('You must be signed in to register for events.');
    
    const ticketId = `TKT-${Math.random().toString(36).substr(2,9).toUpperCase()}`;

    const newReg = {
      user_id: user.id,
      event_id: event.id,
      event_title: event.title,
      event_date: event.date,
      event_time: event.time,
      event_venue: event.venue,
      club_name: event.clubName,
      ticket_id: ticketId,
      full_name: profileData.fullName || profile.full_name || '',
      email: profileData.email || user.email || '',
      semester: profileData.semester || profile.semester || '',
      branch: profileData.branch || profile.branch || '',
      student_id: profileData.studentId || profile.student_id || '',
      registered_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('registrations')
      .insert([newReg])
      .select()
      .single();

    if (error) {
      console.error('Error inserting registration:', error);
      throw error;
    }

    // Refresh registrations in local state
    const updatedRegs = await fetchRegistrations(user.id);
    setRegistrations(updatedRegs);
    return { ...newReg, id: ticketId };
  };

  // Listen to Auth changes
  useEffect(() => {
    let mounted = true;

    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!mounted) return;

        if (session?.user) {
          setUser(session.user);
          const prof = await fetchOrCreateProfile(session.user);
          if (mounted) {
            setProfile(prof);
            const regs = await fetchRegistrations(session.user.id);
            if (mounted) setRegistrations(regs);
          }
        } else {
          setUser(null);
          setProfile(null);
          setRegistrations([]);
        }
      } catch (err) {
        console.error('Error initializing session:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      
      if (session?.user) {
        setUser(session.user);
        setLoading(true);
        const prof = await fetchOrCreateProfile(session.user);
        if (mounted) {
          setProfile(prof);
          const regs = await fetchRegistrations(session.user.id);
          if (mounted) setRegistrations(regs);
        }
        setLoading(false);
      } else {
        setUser(null);
        setProfile(null);
        setRegistrations([]);
        setLoading(false);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    user,
    profile,
    registrations,
    loading,
    signUp,
    signInWithEmail,
    signInWithGoogle,
    signOut,
    updateProfile,
    registerForEvent,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
