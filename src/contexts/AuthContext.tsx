/**
 * React context untuk SSO session.
 * Fetch /api/auth/me saat mount — server middleware yang memvalidasi JWE cookie.
 */
import React, { createContext, useContext, useEffect, useState } from 'react';

export interface SSOUser {
  sub: string;
  name?: string;
  email?: string;
  phone?: string;
  realm?: string;
  exp: number;
}

interface AuthState {
  loading: boolean;
  user: SSOUser | null;
}

const AuthContext = createContext<AuthState>({ loading: true, user: null });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ loading: true, user: null });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((r) => (r.ok ? r.json() : { authenticated: false }))
      .then((data) => {
        setState({ loading: false, user: data.authenticated ? data.user : null });
      })
      .catch(() => setState({ loading: false, user: null }));
  }, []);

  return <AuthContext.Provider value={state}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
