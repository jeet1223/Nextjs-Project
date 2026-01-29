'use client';
import { createContext, useState, useEffect, ReactNode, useCallback } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  accessToken: string | null;
  login: (token: string) => void;
  logout: () => void;
  fetchWithAuth: (url: string, options?: RequestInit) => Promise<unknown>;
  refreshAccessToken: () => Promise<boolean>;
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  accessToken: null,
  login: () => {},
  logout: () => {},
  fetchWithAuth: async () => {},
  refreshAccessToken: async () => false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const isLoggedIn = !!accessToken;

  // Login function - stores access token in memory
  // Refresh token is automatically stored in httpOnly cookie by the server
  const login = (token: string) => {
    setAccessToken(token);
    // Store access token temporarily for page reloads (will be refreshed)
    sessionStorage.setItem('access_token', token);
  };

  // Logout function - clears tokens and calls logout API
  const logout = useCallback(async () => {
    setAccessToken(null);
    sessionStorage.removeItem('access_token');
    
    try {
      await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include', // Send cookies
      });
    } catch (err) {
      console.error('Logout API call failed:', err);
    }
  }, []);

  // Refresh access token using refresh token from httpOnly cookie
  const refreshAccessToken = useCallback(async (): Promise<boolean> => {
    if (isRefreshing) return false;
    
    setIsRefreshing(true);
    try {
      const res = await fetch('/api/users/refreshToken', {
        method: 'POST',
        credentials: 'include', // Send httpOnly cookie with refresh token
      });

      if (res.ok) {
        const data = await res.json();
        if (data.accessToken) {
          setAccessToken(data.accessToken);
          sessionStorage.setItem('access_token', data.accessToken);
          setIsRefreshing(false);
          return true;
        }
      }
      
      // Refresh failed - logout
      await logout();
      setIsRefreshing(false);
      return false;
    } catch (err) {
      console.error('Error refreshing token:', err);
      await logout();
      setIsRefreshing(false);
      return false;
    }
  }, [isRefreshing, logout]);

  // Auto-refresh token on mount if access token exists in sessionStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem('access_token');
      
      if (storedToken) {
        // Try to use stored token, but refresh it to verify it's still valid
        setAccessToken(storedToken);
        await refreshAccessToken();
      } else {
        // No stored token, try to refresh from httpOnly cookie
        await refreshAccessToken();
      }
    };

    initAuth();
  }, []); // Only run once on mount

  // Auto-refresh token before it expires (15 minutes - refresh at 14 minutes)
  useEffect(() => {
    if (!accessToken) return;

    const refreshInterval = setInterval(() => {
      refreshAccessToken();
    }, 14 * 60 * 1000); // 14 minutes

    return () => clearInterval(refreshInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  // Fetch with automatic token refresh on 401
  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const makeRequest = async (token: string) => {
      const requestOptions: RequestInit = {
        ...options,
        headers: {
          ...(options.headers || {}),
          Authorization: `Bearer ${token}`,
        },
        credentials: 'include',
      };

      return fetch(url, requestOptions);
    };

    if (!accessToken) {
      throw new Error('Not authenticated');
    }

    let res = await makeRequest(accessToken);

    // If unauthorized, try to refresh token and retry
    if (res.status === 401) {
      const refreshed = await refreshAccessToken();
      
      if (refreshed && accessToken) {
        // Retry request with new token
        res = await makeRequest(accessToken);
      } else {
        throw new Error('Session expired. Please log in again.');
      }
    }

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(errorData.error || 'Request failed');
    }

    return res.json();
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, accessToken, login, logout, fetchWithAuth, refreshAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
}
