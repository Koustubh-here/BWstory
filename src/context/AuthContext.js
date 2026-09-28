import React, { createContext, useContext, useEffect, useState } from 'react';
import { isSupabaseConfigured } from '../config/supabase';
import { getCurrentUser } from '../lib/supabaseData';

const AuthContext = createContext({ user: null, loading: true, error: null });

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(isSupabaseConfigured);
    const [error, setError] = useState(isSupabaseConfigured ? null : new Error('Add your Supabase URL and anon key in src/config/supabase.js'));

    useEffect(() => {
        if (!isSupabaseConfigured) return undefined;
        getCurrentUser().then(setUser).catch(setError).finally(() => setLoading(false));
        return undefined;
    }, []);

    return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    return useContext(AuthContext);
}
