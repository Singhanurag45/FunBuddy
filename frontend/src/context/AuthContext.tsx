import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { api } from '../services/api';
import type { UserProfile } from '../services/api';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  login: (userData: any, token: string) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    if (typeof window === 'undefined') return null;

    const storedUser = localStorage.getItem('learnify_user');
    if (!storedUser) return null;

    try {
      return JSON.parse(storedUser) as UserProfile;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    return Boolean(localStorage.getItem('learnify_token'));
  });

  // Initialize from Local Storage
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const storedUser = localStorage.getItem('learnify_user');
      const token = localStorage.getItem('learnify_token');

      if (token) {
        try {
          const parsedUser = storedUser ? JSON.parse(storedUser) : null;
          api.setToken(token);

          if (parsedUser) {
            setUser(parsedUser);
            const latestProfile = await api.getUserProfile(parsedUser.id || parsedUser.userId);
            setUser(latestProfile);
            localStorage.setItem('learnify_user', JSON.stringify(latestProfile));
          }
        } catch (error) {
          console.error("Failed to restore session", error);
          logout();
        }
      } else {
        setLoading(false);
        return;
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnify_user');
    localStorage.removeItem('learnify_token');
    api.setToken(null);
  };

  const login = async (userData: any, token: string) => {
    const profileData: UserProfile = {
      id: userData.userId || userData.id,
      name: userData.name,
      points: userData.points || 0,
      level: userData.level || 1,
      streak: userData.streak || 0,
      badges: userData.badges || [],
    };

    try {
      api.setToken(token);
      const fetchedFullProfile = await api.getUserProfile(profileData.id);
      Object.assign(profileData, fetchedFullProfile);
    } catch(e) {
      console.error("Could not fetch extended profile details", e);
    }

    setUser(profileData);
    localStorage.setItem('learnify_user', JSON.stringify(profileData));
    localStorage.setItem('learnify_token', token);
  };

  const refreshUser = async () => {
    if (user?.id) {
       const fresh = await api.getUserProfile(user.id);
       setUser(fresh);
       localStorage.setItem('learnify_user', JSON.stringify(fresh));
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
