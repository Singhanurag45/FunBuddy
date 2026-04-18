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
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize from Local Storage
  useEffect(() => {
    const initAuth = async () => {
      const storedUser = localStorage.getItem('learnify_user');
      const token = localStorage.getItem('learnify_token');
      
      if (storedUser && token) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          // Set headers immediately
          api.setToken(token);
          
          // Optionally, wait to strictly fetch latest profile from backend before displaying
          // This keeps points perfectly in sync if they left the window open
          const latestProfile = await api.getUserProfile(parsedUser.id || parsedUser.userId);
          setUser(latestProfile);
          localStorage.setItem('learnify_user', JSON.stringify(latestProfile));
        } catch (error) {
          console.error("Failed to restore session", error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (userData: any, token: string) => {
    // Transform missing fields for our UI
    const profileData: UserProfile = {
      id: userData.userId || userData.id,
      name: userData.name,
      points: userData.points || 0,
      level: userData.level || 1,
      streak: userData.streak || 0, // Not in backend yet, defaulting to 0
      badges: userData.badges || [], // Defaulting to empty
    };
    
    // Attempt to enrich it with actual backend points/levels via the ID lookup
    try {
      api.setToken(token); // Required for authenticated requests!
      const fetchedFullProfile = await api.getUserProfile(profileData.id);
      Object.assign(profileData, fetchedFullProfile);
    } catch(e) {
      console.error("Could not fetch extended profile details", e);
    }

    setUser(profileData);
    localStorage.setItem('learnify_user', JSON.stringify(profileData));
    localStorage.setItem('learnify_token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('learnify_user');
    localStorage.removeItem('learnify_token');
    api.setToken(null);
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
