// src/lib/auth-provider.tsx
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiPost } from './api';
import { type User } from './data';
import { getUser, mapUser } from './services';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: Record<string, any>) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const logout = useCallback(() => {
    // Não é mais necessário chamar a API, pois o token é invalidado no lado do cliente
    // e a segurança é garantida pela falta do token nas requisições subsequentes.
    localStorage.removeItem('authToken');
    localStorage.removeItem('userId');
    setToken(null);
    setUser(null);
    // Força o redirecionamento para a página inicial para evitar estados inconsistentes
    router.push('/');
  }, [router]);


  // Função para buscar e atualizar os dados do usuário do backend
  const refreshUser = useCallback(async () => {
    const storedUserId = localStorage.getItem('userId');
    if (!storedUserId) {
        // Se não há ID, não há usuário para atualizar, então fazemos logout para limpar o estado.
        logout();
        return;
    }
    try {
        const updatedUserData = await getUser(storedUserId);
        if (updatedUserData) {
            setUser(updatedUserData);
        } else {
            // Se não encontrar o usuário (ex: foi deletado), força logout
            logout();
        }
    } catch (error) {
        console.error("Falha ao atualizar os dados do usuário, forçando logout:", error);
        logout();
    }
  }, [logout]);


  useEffect(() => {
    let mounted = true;
    const initializeAuth = async () => {
      setIsLoading(true);
      const storedToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : null;
      
      if (storedToken) {
        setToken(storedToken);
        // Em vez de apenas pegar o ID, chamamos o refreshUser que já tem a lógica completa.
        await refreshUser();
      }
      
      if (mounted) {
        setIsLoading(false);
      }
    };

    initializeAuth();
    return () => { mounted = false; };
  }, [refreshUser]);


  const handleAuthSuccess = (response: any) => {
    const apiResponse = response.data || response;
    const apiUser = apiResponse.user;
    const apiToken = apiResponse.token;
    
    const mappedUser = mapUser(apiUser);
    localStorage.setItem('authToken', apiToken);
    localStorage.setItem('userId', mappedUser.id.toString());
    setToken(apiToken);
    setUser(mappedUser);
  };

  const login = async (email: string, password: string) => {
    const response = await apiPost<any>('login', {
      email,
      password: password,
      device_name: 'browser',
    });
    handleAuthSuccess(response);
  };

  const register = async (data: Record<string, any>) => {
    await apiPost('users', data);
    await login(data.email, data.password);
  };

  const value = { user, token, isLoading, login, register, logout, refreshUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  return context;
}
