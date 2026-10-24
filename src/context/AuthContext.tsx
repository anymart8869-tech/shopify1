import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { INITIAL_USERS } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<boolean>;
  signup: (email: string, fullName: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'storenova_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    // Default to store owner for immediate rich merchant exploration
    return INITIAL_USERS[1]; // Sarah Jenkins (Store Owner)
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  const login = async (email: string, preferredRole?: UserRole): Promise<boolean> => {
    // Find matching user or generate
    const matched = INITIAL_USERS.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setUser(matched);
      return true;
    }
    
    // Create session for user
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      email,
      full_name: email.split('@')[0],
      role: preferredRole || 'store_owner',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`,
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    return true;
  };

  const signup = async (email: string, fullName: string, role: UserRole): Promise<boolean> => {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      email,
      full_name: fullName,
      role,
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName}`,
      created_at: new Date().toISOString()
    };
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: UserRole) => {
    const demoUser = INITIAL_USERS.find(u => u.role === newRole);
    if (demoUser) {
      setUser(demoUser);
    } else if (user) {
      setUser({ ...user, role: newRole });
    }
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'customer',
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        switchRole,
        updateProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
