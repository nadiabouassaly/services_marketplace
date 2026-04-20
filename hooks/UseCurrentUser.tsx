"use client"
 
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/db';
 
export function useCurrentUser() {
  const [userId, setUserId] = useState<string | null>(null);
 
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data.session?.user.id ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user.id ?? null);
    });
 
    return () => listener.subscription.unsubscribe();
  }, []);
 
  return { userId };
}
 
