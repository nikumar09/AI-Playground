import React, { createContext, useContext, useState, useEffect } from 'react';
import { type AppUser, SEED_USERS, fullName } from '../types/auth';

const STORAGE_KEY = 'teamtracker-auth';

interface StoredState {
  currentUserId: string | null;
  users: AppUser[];
}

interface AuthResult {
  success: boolean;
  error?: string;
}

interface AuthContextValue {
  currentUser: AppUser | null;
  users: AppUser[];
  activeUsers: AppUser[];
  signIn: (email: string) => AuthResult;
  signOut: () => void;
  signUp: (firstName: string, lastName: string, email: string) => AuthResult;
  updateProfile: (updates: Partial<Pick<AppUser, 'firstName' | 'lastName' | 'avatarDataUrl'>>) => void;
  toggleUserStatus: (userId: string) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadState(): StoredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as StoredState;
  } catch { /* ignore */ }
  return { currentUserId: null, users: SEED_USERS };
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<StoredState>(loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch { /* unavailable in test env */ }
  }, [state]);

  const currentUser = state.users.find(u => u.id === state.currentUserId) ?? null;
  const activeUsers = state.users.filter(u => u.status === 'active');

  const signIn = (email: string): AuthResult => {
    const trimmed = email.trim().toLowerCase();
    const user = state.users.find(u => u.email.toLowerCase() === trimmed);
    if (!user) return { success: false, error: 'No account found with that email. Please sign up.' };
    if (user.status === 'inactive') return { success: false, error: 'Your account has been deactivated. Contact your administrator.' };
    setState(s => ({ ...s, currentUserId: user.id }));
    return { success: true };
  };

  const signOut = () => setState(s => ({ ...s, currentUserId: null }));

  const signUp = (firstName: string, lastName: string, email: string): AuthResult => {
    const trimmed = email.trim().toLowerCase();
    if (state.users.some(u => u.email.toLowerCase() === trimmed)) {
      return { success: false, error: 'An account with that email already exists. Please sign in.' };
    }
    const colors = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#EC4899'];
    const newUser: AppUser = {
      id: `u${Date.now()}`,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: trimmed,
      role: 'user',
      status: 'active',
      avatarColor: colors[state.users.length % colors.length],
    };
    setState(s => ({ users: [...s.users, newUser], currentUserId: newUser.id }));
    return { success: true };
  };

  const updateProfile = (updates: Partial<Pick<AppUser, 'firstName' | 'lastName' | 'avatarDataUrl'>>) => {
    if (!currentUser) return;
    setState(s => ({
      ...s,
      users: s.users.map(u => u.id === s.currentUserId ? { ...u, ...updates } : u),
    }));
  };

  const toggleUserStatus = (userId: string) => {
    if (!currentUser || currentUser.role !== 'admin') return;
    if (userId === currentUser.id) return; // admin cannot deactivate themselves
    setState(s => ({
      ...s,
      users: s.users.map(u =>
        u.id === userId ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u
      ),
    }));
  };

  return (
    <AuthContext.Provider value={{ currentUser, users: state.users, activeUsers, signIn, signOut, signUp, updateProfile, toggleUserStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

// Convenience export for components that just need the full name helper
export { fullName };
