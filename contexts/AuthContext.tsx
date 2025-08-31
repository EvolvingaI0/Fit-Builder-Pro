
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import useLocalStorage from '../hooks/useLocalStorage';

interface AuthContextType {
  currentUser: User | null;
  users: User[];
  isLoading: boolean;
  isSaving: boolean;
  login: (email: string, pass: string) => void;
  signUp: (email: string, pass: string) => void;
  logout: () => void;
  updateUser: (updatedUser: User) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [users, setUsers] = useLocalStorage<User[]>('fitBuilderProAccounts', []);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    // Tenta carregar o usuário da sessão ao iniciar a aplicação
    try {
        const loggedInUserEmail = sessionStorage.getItem('fitBuilderProSession');
        if (loggedInUserEmail) {
            const user = users.find(u => u.email === loggedInUserEmail);
            if (user) {
                setCurrentUser(user);
            }
        }
    } catch (error) {
        console.error("Failed to load user session", error);
        sessionStorage.removeItem('fitBuilderProSession');
    }
    setIsLoading(false);
  }, [users]);

  const login = (email: string, pass: string) => {
    const user = users.find(u => u.email === email);
    if (user && user.password === pass) {
      setCurrentUser(user);
      sessionStorage.setItem('fitBuilderProSession', user.email);
    } else {
      throw new Error('Email ou senha inválidos.');
    }
  };

  const signUp = (email: string, pass: string) => {
    if (users.some(u => u.email === email)) {
      throw new Error('Este email já está em uso.');
    }
    const newUser: User = { email, password: pass };
    setUsers([...users, newUser]);
    setCurrentUser(newUser);
    sessionStorage.setItem('fitBuilderProSession', newUser.email);
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('fitBuilderProSession');
  };

  const updateUser = async (updatedUser: User) => {
    setIsSaving(true);
    setCurrentUser(updatedUser);
    setUsers(prevUsers => 
      prevUsers.map(u => u.email === updatedUser.email ? updatedUser : u)
    );
    // Simulate async save operation for better UX
    await new Promise(res => setTimeout(res, 500));
    setIsSaving(false);
  };

  const value = {
    currentUser,
    users,
    isLoading,
    isSaving,
    login,
    signUp,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
